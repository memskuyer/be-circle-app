import { NextFunction, Request, Response } from 'express';
import threadService from '../services/thread.service';
import { createThreadShema } from '../utils/schemas/thread.validator';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import { likeUnlikeSchema } from '../utils/schemas/like.validator';
import likesService from '../services/likes.service';

class likeController {
  async likeUnlike(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/likeUnlikeDTO"
                    }  
                }
            }
        } 
    */
    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { threadId } = await likeUnlikeSchema.validateAsync(body);

      const like = await likesService.getLikeByid(userId, threadId);

      if (like) {
        await likesService.deleteLike(like.id);
        res.status(201).json({
          message: 'unlinke success!',
        });
        return;
      }

      await likesService.createLike(userId, threadId);
      res.status(201).json({
        message: 'Like success!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new likeController();
