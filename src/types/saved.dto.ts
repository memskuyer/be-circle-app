import { Saved } from '@prisma/client';

export type savedUnsaved = Pick<Saved, 'threadId'>;
