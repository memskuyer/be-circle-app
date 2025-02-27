import Joi from 'joi';
import { CreateReplyDto } from '../../types/reply.dto';

export const createReplySchema = Joi.object<CreateReplyDto>({
  content: Joi.string().max(280),
});
