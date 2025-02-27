import { prisma } from '../libs/prisma';
import { LoginDTO, RegisterDTO, resetPasswordDTO } from '../types/auth.dto';
import { createUserDTO, updateUserDTO } from '../types/user.dto';

class authService {
  async register(data: RegisterDTO) {
    const { fullName, ...userData } = data;
    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async resetPassword(email: string, hashedNewPassword: string) {
    return await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedNewPassword,
      },
    });
  }

  async getDataByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
      },
      omit: {
        password: true,
      },
    });
  }

  async getDataByUsername(username: string) {
    return await prisma.user.findFirst({
      where: {
        username,
      },
      omit: {
        password: true,
      },
    });
  }
}

export default new authService();
