import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import likesService from '../services/likes.service';
import threadService from '../services/thread.service';
import {
  createThreadShema,
  editThreadShema,
} from '../utils/schemas/thread.validator';
import { log } from 'node:console';
import savedService from '../services/saved.service';

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
          const saved = await savedService.getSavedById(thread.id, userId);
          const isSaved = saved ? true : false;

          return {
            ...thread,
            likesCount,
            repliesCount,
            isLiked,
            isSaved,
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

  async updateThreadById(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
              required: true,
              description: "Edit Thread",
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/EditThreadDTO"
                      }  
                  }
              }
          } 
      */
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await threadService.getThreadsById(id);

      if (!data) {
        res.status(404).json({ message: 'Thread not found' });
        return;
      }

      let oldImage = undefined;
      let uploadResult: UploadApiResponse = {} as UploadApiResponse;
      if (req.file) {
        uploadResult = await cloudinary.uploader.upload(req.file?.path || '');
      } else {
        if (data.images) {
          oldImage = data.images || undefined;
        }
      }

      if (userId !== data?.user.id) {
        res.status(403).json({ message: `it's not your right to change` });
        return;
      }

      const body = {
        ...req.body,
        images: uploadResult.secure_url ?? oldImage,
      };

      const validateBody = await editThreadShema.validateAsync(body);
      if (!validateBody.content) {
        validateBody.content = data?.content || req.body.content;
      }

      const updateData = await threadService.editThread(id, validateBody);
      res.status(200).json({ message: 'Success', updateData });
    } catch (error) {
      next(error);
    }
  }

  async deleteThread(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await threadService.getThreadsById(id);

      if (!data) {
        res.status(404).json({ message: 'Thread Not Found' });
        return;
      }

      if (userId !== data?.user.id) {
        res.status(400).json({ message: 'it is not your right to delete' });
        return;
      }

      await threadService.deleteThreadById(id);
      res.status(200).json({ message: 'Success Delete Thread', data });
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
