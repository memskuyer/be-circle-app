import { prisma } from '../libs/prisma';
import { CreateThreadDTO } from '../types/thread.dto';

class ThreadService {
  async getThreads() {
    return await prisma.thread.findMany({
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getThreadsById(id: string) {
    return await prisma.thread.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
    });
  }

  async getThreadsByUserId(userId: string) {
    return await prisma.thread.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        user: {
          omit: {
            password: true,
            email: true,
          },
          include: {
            profile: true,
          },
        },
        likes: true,
        replies: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async editThread(id: string, data: CreateThreadDTO) {
    return await prisma.thread.update({
      data,
      where: {
        id,
      },
    });
  }

  async createThread(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;
    return await prisma.thread.create({
      data: {
        content,
        images,
        userId,
      },
    });
  }

  async deleteThreadById(id: string) {
    await prisma.like.deleteMany({
      where: {
        threadId: id,
      },
    });

    await prisma.reply.deleteMany({
      where: {
        threadId: id,
      },
    });

    return await prisma.thread.delete({
      where: {
        id,
      },
    });
  }
}

export default new ThreadService();
