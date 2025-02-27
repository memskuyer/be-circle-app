import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullName'];
};

export type RegisterDTO = Pick<
  UserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;
export type LoginDTO = Pick<User, 'email' | 'password'>;

export type ForgotPasswordDTO = Pick<User, 'email'>;
export type resetPasswordDTO = {
  oldPassword: string;
  newPassword: string;
};
