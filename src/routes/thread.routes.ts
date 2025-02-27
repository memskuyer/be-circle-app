import express from 'express';
import threadController from '../controllers/thread.controller';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import { uploadImage } from '../middlewares/multer.middleware';
import { authCheck } from '../middlewares/auth-check.middleware';
const router = express.Router();

router.get('/', authCheck, threadController.getThread);
router.get('/user-threads', authCheck, threadController.getUserThread);
router.get('/user-threads/:id', authCheck, threadController.getUserThreadById);
router.get('/:id', authCheck, threadController.getThreadById);
router.post(
  '/',
  authCheck,
  initCloudinary,
  uploadImage.single('images'),
  threadController.createThread,
);

export default router;
