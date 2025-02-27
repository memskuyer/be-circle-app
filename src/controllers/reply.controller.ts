import { NextFunction, Request, Response } from 'express';
import replyService from '../services/reply.service';
import { createReplySchema } from '../utils/schemas/reply.validator';
import { log } from 'node:console';

class replyController {
  async getReplyByThreadId(req: Request, res: Response, next: NextFunction) {
    try {
      const threadId = req.params.threadId;
      const replies = await replyService.getReplyByThreadId(threadId);
      res.status(200).json({ message: 'success', data: replies });
    } catch (error) {
      next(error);
    }
  }
  async createReply(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateReplyDTO"
                    }  
                }
            }
        } 
    */
    try {
      const threadId = req.params.threadId;
      const body = req.body;
      const userId = (req as any).user.id;
      const validateBody = await createReplySchema.validateAsync(body);
      const reply = await replyService.createReply(
        userId,
        threadId,
        validateBody,
      );

      res.status(200).json({ message: 'success', data: { ...reply } });
    } catch (error) {
      next(error);
    }
  }
}

export default new replyController();
