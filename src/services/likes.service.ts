import { prisma } from '../libs/prisma';

class likeService {
  async getLikeByid(userId: string, threadId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        threadId,
      },
    });
  }

  async createLike(userId: string, threadId: string) {
    return await prisma.like.create({
      data: {
        userId,
        threadId,
      },
    });
  }

  async deleteLike(id: string) {
    return await prisma.like.delete({
      where: {
        id,
      },
    });
  }
}

export default new likeService();
