import { profile } from 'console';
import { prisma } from '../libs/prisma';
import { createUserDTO, updateUserDTO } from '../types/user.dto';

class UserService {
  async getUsers(search?: string) {
    return await prisma.user.findMany({
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
      where: search
        ? {
            OR: [
              {
                username: {
                  contains: search,
                },
              },
              {
                profile: {
                  fullName: {
                    contains: search,
                  },
                },
              },
            ],
          }
        : {},
    });
  }

  async getAllUsers() {
    return await prisma.user.findMany({
      omit: {
        password: true,
      },
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
    });
  }

  async getUsersById(id: string) {
    return await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });
  }

  async createUsers(data: createUserDTO) {
    const { fullName, ...userData } = data;
    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async updateUserById(id: string, data: updateUserDTO) {
    const { username, bio, fullName, avatarUrl, bannerUrl } = data;
    return await prisma.user.update({
      omit: {
        password: true,
      },
      data: {
        username,
        profile: {
          update: {
            fullName,
            bio,
            avatarUrl,
            bannerUrl,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  async deleteUserById(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default new UserService();
