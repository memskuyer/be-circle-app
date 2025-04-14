import { NextFunction, Request, Response } from 'express';
import followService from '../services/follow.service';
import userService from '../services/user.service';
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

  async getFollowerFolowing(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;

    const user = await userService.getUsersById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const following = await Promise.all(
      user.followings.map(async (follow) => {
        const getUser = await userService.getUsersById(follow.followedId);
        if (!getUser) {
          return null;
        }
        const {
          followers: _followers,
          followings: _followings,
          password: _password,
          ...getUserResponse
        } = getUser;

        const getFollow = await followService.getFollowById(
          userId,
          follow.followedId,
        );

        const isFollow = getFollow ? true : false;
        const isFollower = getFollow ? true : false;

        return {
          ...getUserResponse,
          isFollow,
          isFollower,
        };
      }),
    );

    const follower = await Promise.all(
      user.followers.map(async (follow) => {
        const getUser = await userService.getUsersById(follow.followingId);
        if (!getUser) {
          return null;
        }
        const {
          followers: _followers,
          followings: _followings,
          password: _password,
          ...getUserResponse
        } = getUser;
        const getFollow = await followService.getFollowById(
          userId,
          follow.followingId,
        );
        const isFollow = getFollow ? true : false;
        const isFollower = getFollow ? true : false;

        return {
          ...getUserResponse,
          isFollow,
          isFollower,
        };
      }),
    );

    res.status(200).json({ message: 'Success', data: { following, follower } });
  }
}

export default new followController();
