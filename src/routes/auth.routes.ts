import express from 'express';
import authController from '../controllers/auth.controller';
import { authCheck } from '../middlewares/auth-check.middleware';
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/check', authCheck, authController.authCheck);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authCheck, authController.resetPassword);

export default router;
