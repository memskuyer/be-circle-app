import { prisma } from '../libs/prisma';
import { CreateReplyDto } from '../types/reply.dto';

class ReplyService {
  async getReplyByThreadId(threadId: string) {
    return await prisma.reply.findMany({
      where: { threadId },
      include: {
        user: {
          omit: {
            password: true,
          },
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createReply(userId: string, threadId: string, data: CreateReplyDto) {
    const { content } = data;
    return await prisma.reply.create({
      data: {
        threadId,
        content,
        userId,
      },
    });
  }
}
export default new ReplyService();
