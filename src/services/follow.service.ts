import { prisma } from '../libs/prisma';

class followService {
  async getFollowById(followingId: string, followedId: string) {
    return await prisma.follow.findFirst({
      where: {
        followingId,
        followedId,
      },
    });
  }

  async createFollow(followingId: string, followedId: string) {
    return await prisma.follow.create({
      data: {
        followingId,
        followedId,
      },
    });
  }

  async deleteFollow(id: string) {
    return await prisma.follow.delete({
      where: {
        id,
      },
    });
  }
}

export default new followService();
