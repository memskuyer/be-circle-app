import express from 'express';
import followController from '../controllers/follow.controller';
import { authCheck } from '../middlewares/auth-check.middleware';

const router = express.Router();

router.post('/', authCheck, followController.followUnfollow);

export default router;
