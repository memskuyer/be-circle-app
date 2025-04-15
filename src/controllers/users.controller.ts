import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import followService from '../services/follow.service';
import userService from '../services/user.service';
import {
  createUserSchema,
  updateUserSchema,
} from '../utils/schemas/user.validator';
import { log } from 'node:console';

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const search = req.query.search as string;

      const users = await userService.getUsers(search);
      const userData = users.filter((fill) => fill.id !== userId);

      const newUser = await Promise.all(
        userData.map(async (user) => {
          const follow = await followService.getFollowById(userId, user.id);
          const isFollow = follow ? true : false;
          const isFollower = follow ? true : false;
          const followerCount = user.followers.length;
          const followingCount = user.followings.length;
          const { password: unUsedPassword, ...data } = user;
          return {
            ...data,
            isFollow,
            isFollower,
            followerCount,
            followingCount,
          };
        }),
      );

      if (!userData) {
        res.status(404).json({ message: 'Data Tidak Ditemukan' });
        return;
      }
      res.status(200).json({ message: 'Success', data: newUser });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;

      const users = await userService.getAllUsers();
      const userData = users.filter((fill) => fill.id !== userId);

      if (!userData) {
        res.status(404).json({ message: 'Data Tidak Ditemukan' });
        return;
      }

      const newUser = await Promise.all(
        userData.map(async (user) => {
          const follow = await followService.getFollowById(userId, user.id);
          const isFollow = follow ? true : false;
          const followerLength = user.followers.length;

          const getDataFollower = user.followings.some(
            (foll) => userId == foll.followedId,
          );

          return {
            ...user,
            followerLength,
            isFollower: getDataFollower,
            isFollow,
          };
        }),
      );

      const filteredUser = newUser.filter((user) => !user.isFollow);

      const filterLengsh = filteredUser
        .map((a) => a)
        .sort((a, b) => b.followerLength - a.followerLength)
        .sort((f, g) => Number(g.isFollower) - Number(f.isFollower));

      res.status(200).json({ message: 'Success', data: filterLengsh });
    } catch (error) {
      next(error);
    }
  }

  async getUsersById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const users = await userService.getUsersById(id);
      if (users?.followers && users.followers.length > 0) {
        const getFollowers = await Promise.all(
          users?.followers.map(async (data) => {
            const dataFollowers = await followService.getFollowById(
              userId,
              data.followedId,
            );

            const isFollow = dataFollowers ? true : false;
            return {
              ...data,
              isFollow,
            };
          }),
        );
        users.followers = getFollowers;
      }
      if (!users) {
        res.status(404).json({ message: 'Data Tidak Ditemukan' });
        return;
      }

      const { password: unUsedPassword, ...usersData } = users;

      res.status(200).json({ message: 'Success', data: { ...usersData } });
    } catch (error) {
      next(error);
    }
  }

  async createUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validateBody = await createUserSchema.validateAsync(body);
      const user = await userService.createUsers(validateBody);
      res.status(200).json({ message: 'Success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateUserById(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
              required: true,
              description: "Update Profile",
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/UpdateProfileDTO"
                      }  
                  }
              }
          } 
      */
    try {
      const userId = (req as any).user.id;

      let avatarUrl: string | undefined;
      let bannerUrl: string | undefined;

      const files = req.files as unknown as Record<
        string,
        Express.Multer.File[]
      >;

      if (files?.['avatarUrl']?.[0]) {
        const uploadedAvatar = await cloudinary.uploader.upload(
          files['avatarUrl'][0].path,
        );
        avatarUrl = uploadedAvatar.secure_url;
      }

      if (files?.['bannerUrl']?.[0]) {
        const uploadedBanner = await cloudinary.uploader.upload(
          files['bannerUrl'][0].path,
        );
        bannerUrl = uploadedBanner.secure_url;
      }

      console.log('ava', avatarUrl);
      console.log('ban', bannerUrl);

      const body = {
        ...req.body,
        avatarUrl,
        bannerUrl,
      };

      const validateBody = await updateUserSchema.validateAsync(body);

      const users = await userService.updateUserById(userId, validateBody);
      res.status(200).json({ message: 'Success', data: { users, body } });
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUsersById(id);
      if (!user) {
        res.status(404).json({ message: 'Data Tidak Ditemukan' });
        return;
      }

      const delteUsers = await userService.deleteUserById(id);
      res.status(200).json({ message: 'Success', data: delteUsers });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
