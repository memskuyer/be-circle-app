import { Follow } from '@prisma/client';

export type followUnfollow = Pick<Follow, 'followingId'>;
