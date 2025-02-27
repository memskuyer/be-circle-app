import Joi from 'joi';
import { followUnfollow } from '../../types/follow.dto';

export const FollowUnfollowSchema = Joi.object<followUnfollow>({
  followingId: Joi.string().uuid(),
});
