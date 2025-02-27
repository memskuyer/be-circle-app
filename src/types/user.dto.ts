import { Profile, User } from '@prisma/client';

type UserProfile = User & {
  fullName: Profile['fullName'];
  avatarUrl?: Profile['avatarUrl'];
  bannerUrl?: Profile['bannerUrl'];
  bio?: Profile['bio'];
};

export type createUserDTO = Pick<
  UserProfile,
  'email' | 'username' | 'password' | 'fullName'
>;
export type updateUserDTO = Pick<
  UserProfile,
  'email' | 'username' | 'fullName' | 'avatarUrl' | 'bannerUrl' | 'bio'
>;
