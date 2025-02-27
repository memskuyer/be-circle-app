import Joi from 'joi';
import { CreateThreadDTO } from '../../types/thread.dto';

export const createThreadShema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(280),
  images: Joi.string(),
});
