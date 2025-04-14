import Joi from 'joi';
import { savedUnsaved } from '../../types/saved.dto';

export const SavedUnsaved = Joi.object<savedUnsaved>({
  threadId: Joi.string().uuid(),
});
