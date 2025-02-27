import { Reply } from '@prisma/client';

export type CreateReplyDto = Pick<Reply, 'content'>;
