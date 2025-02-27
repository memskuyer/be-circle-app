import Joi from 'joi';
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  resetPasswordDTO,
} from '../../types/auth.dto';

export const loginSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const registerSchema = Joi.object<RegisterDTO>({
  email: Joi.string().email().required(),
  username: Joi.string().min(8).max(12).required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().max(100),
});

export const forgotPasswordSchema = Joi.object<ForgotPasswordDTO>({
  email: Joi.string().email(),
});
export const resetPasswordSchema = Joi.object<resetPasswordDTO>({
  oldPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});
