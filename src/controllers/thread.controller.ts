import { NextFunction, Request, Response } from 'express';
import threadService from '../services/thread.service';
import { createThreadShema } from '../utils/schemas/thread.validator';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import likesService from '../services/likes.service';

class threadController {
  async getThread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await threadService.getThreads();
      const newThread = await Promise.all(
        data.map(async (thread) => {
          const like = await likesService.getLikeByid(userId, thread.id);
          const isLiked = like ? true : false;
          const likesCount = thread.likes.length;
          const repliesCount = thread.replies.length;

          return {
            ...thread,
            likesCount,
            repliesCount,
            isLiked,
          };
        }),
      );

      res.status(200).json({ message: 'Success', data: newThread });
    } catch (error) {
      next(error);
    }
  }

  async getThreadById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const data = await threadService.getThreadsById(id);

      if (!data) {
        res.status(404).json({ message: 'Thread not found' });
        return;
      }

      const newThread = await likesService.getLikeByid(userId, id);
      const isLiked = newThread ? true : false;
      const likesCount = data.likes.length;
      const repliesCount = data.replies.length;
      res.status(200).json({
        message: 'Success',
        data: { ...data, isLiked, repliesCount, likesCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserThread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const data = await threadService.getThreadsByUserId(userId);

      const userThread = await Promise.all(
        data.map(async (field) => {
          const newThread = await likesService.getLikeByid(userId, field.id);
          const isLiked = newThread ? true : false;
          const likesCount = field.likes.length;
          const repliesCount = field.replies.length;
          return { ...field, isLiked, repliesCount, likesCount };
        }),
      );

      res.status(200).json({ message: 'Success', data: userThread });
    } catch (error) {
      next(error);
    }
  }

  async getUserThreadById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await threadService.getThreadsByUserId(id);

      const userThread = await Promise.all(
        data.map(async (field) => {
          const newThread = await likesService.getLikeByid(userId, field.id);
          const isLiked = newThread ? true : false;
          const likesCount = field.likes.length;
          const repliesCount = field.replies.length;
          return { ...field, isLiked, repliesCount, likesCount };
        }),
      );

      res.status(200).json({ message: 'Success', data: userThread });
    } catch (error) {
      next(error);
    }
  }

  async createThread(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
              required: true,
              description: "Post Thread",
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/CreateThreadDTO"
                      }  
                  }
              }
          } 
      */
    try {
      let uploadResult: UploadApiResponse = {} as UploadApiResponse;

      if (req.file) {
        uploadResult = await cloudinary.uploader.upload(req.file?.path || '');
        fs.unlinkSync(req.file.path);
      }

      const body = {
        ...req.body,
        images: uploadResult?.secure_url ?? undefined,
      };
      const userId = (req as any).user.id;
      const validateBody = await createThreadShema.validateAsync(body);
      const thread = await threadService.createThread(userId, validateBody);
      res.status(200).json({ message: 'Success', data: { ...thread } });
    } catch (error) {
      next(error);
    }
  }
}

export default new threadController();
