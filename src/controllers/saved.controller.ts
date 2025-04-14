import { NextFunction, Request, Response } from 'express';
import { SavedUnsaved } from '../utils/schemas/saved.validator';
import savedService from '../services/saved.service';
import threadService from '../services/thread.service';

class SavedController {
  async getSaved(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const saveData = await savedService.getSaved(userId);

      if (!saveData) {
        res.status(404).json({ message: 'not found' });
        return;
      }
      const data = await Promise.all(
        saveData.map(async (field) => {
          const dataThread = await threadService.getThreadsById(field.threadId);

          if (!dataThread) {
            res.status(404).json({
              message: 'you have no save thread',
              data,
            });
            return;
          }

          const { id, images } = dataThread;
          return {
            id,
            images,
          };
        }),
      );

      res.status(200).json({
        message: 'Success',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async savedUnsaved(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/SavedUnsaveDTO"
                    }  
                }
            }
        } 
    */
    try {
      const userId = (req as any).user.id;
      const body = req.body;

      const { threadId } = await SavedUnsaved.validateAsync(body);
      const isSaved = await savedService.getSavedById(threadId, userId);

      if (isSaved) {
        await savedService.deleteSaved(isSaved.id);
        res.status(201).json({
          message: 'Unsaved',
        });
        return;
      }
      await savedService.createSaved(threadId, userId);
      res.status(200).json({
        message: 'Saved',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SavedController();
