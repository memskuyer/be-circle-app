import express from 'express';
import userController from '../controllers/users.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
import { initCloudinary } from '../middlewares/cloudinary.middleware';
import { uploadImage } from '../middlewares/multer.middleware';
const router = express.Router();

router.get('/', authCheck, userController.getUsers);
router.get('/all', authCheck, userController.getAllUsers);
router.get('/:id', authCheck, userController.getUsersById);
router.post('/', userController.createUsers);
router.put(
  '/',
  authCheck,
  initCloudinary,
  uploadImage.fields([
    { name: 'avatarUrl', maxCount: 1 },
    { name: 'bannerUrl', maxCount: 1 },
  ]),
  userController.updateUserById,
);
router.delete('/:id', userController.deleteUserById);

export default router;
