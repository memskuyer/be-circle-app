import express from 'express';
import likeController from '../controllers/like.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
const router = express.Router();

router.post('/', authCheck, likeController.likeUnlike);

export default router;
