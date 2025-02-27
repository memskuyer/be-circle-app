import { NextFunction, Request, Response } from 'express';
import followService from '../services/follow.service';
import { FollowUnfollowSchema } from '../utils/schemas/follow.validator';

class followController {
  async followUnfollow(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/followUnfollowDTO"
                    }  
                }
            }
        } 
    */
    try {
      const followedId = (req as any).user.id;

      const body = req.body;
      const { followingId } = await FollowUnfollowSchema.validateAsync(body);
      const follow = await followService.getFollowById(followedId, followingId);

      if (follow) {
        await followService.deleteFollow(follow.id);
        res.status(201).json({
          message: 'Unfollow success!',
        });
        return;
      }

      await followService.createFollow(followedId, followingId);
      res.status(200).json({ message: 'Success', data: follow });
    } catch (error) {
      next(error);
    }
  }
}

export default new followController();
