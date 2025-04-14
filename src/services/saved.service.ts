import { prisma } from '../libs/prisma';

class savedService {
  async getSaved(userId: string) {
    return await prisma.saved.findMany({
      where: {
        userId,
      },
    });
  }

  async getSavedById(threadId: string, userId: string) {
    return await prisma.saved.findFirst({
      where: {
        threadId,
        userId,
      },
    });
  }

  async createSaved(threadId: string, userId: string) {
    return await prisma.saved.create({
      data: {
        threadId,
        userId,
      },
    });
  }

  async deleteSaved(id: string) {
    return await prisma.saved.delete({
      where: {
        id,
      },
    });
  }
}

export default new savedService();
