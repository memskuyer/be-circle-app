import Joi from 'joi';
import { likeUnlike } from '../../types/like.dto';

export const likeUnlikeSchema = Joi.object<likeUnlike>({
  threadId: Joi.string().uuid(),
});
