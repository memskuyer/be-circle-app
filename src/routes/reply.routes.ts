import express from 'express';
import { authCheck } from '../middlewares/auth-check.middleware';
import replyController from '../controllers/reply.controller';
const router = express.Router();

router.get('/:threadId', authCheck, replyController.getReplyByThreadId);
router.post('/:threadId', authCheck, replyController.createReply);

export default router;
