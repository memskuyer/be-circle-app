import Joi from 'joi';
import { CreateThreadDTO } from '../../types/thread.dto';

export const createThreadShema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(280).optional(),
  images: Joi.string(),
});

export const editThreadShema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(280),
  images: Joi.string().optional(),
});
