import Joi from 'joi';
import { createUserDTO, updateUserDTO } from '../../types/user.dto';

export const createUserSchema = Joi.object<createUserDTO>({
  email: Joi.string().email().required(),
  username: Joi.string().min(6).max(12).required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().max(100),
});

export const updateUserSchema = Joi.object<updateUserDTO>({
  username: Joi.string().min(6).max(12),
  fullName: Joi.string().min(4).max(20),
  bio: Joi.string().max(280),
  avatarUrl: Joi.string(),
  bannerUrl: Joi.string(),
});
