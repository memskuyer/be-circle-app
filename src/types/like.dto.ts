import { Like } from '@prisma/client';

export type likeUnlike = Pick<Like, 'threadId'>;
