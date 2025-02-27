require('dotenv').config();
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { transporter } from '../libs/nodemailer';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { RegisterDTO } from '../types/auth.dto';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth.validator';

class authController {
  jwtsecret = process.env.JWT_SECRET_KEY || '';
  async login(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */
    try {
      const body = req.body;

      const { email, password } = await loginSchema.validateAsync(body);

      const user = await userService.getUserByEmail(email);
      if (!user) {
        res.status(404).json({
          message: 'Email Atau Password Salah',
        });
        return;
      }

      const passwordValidate = await bcrypt.compare(password, user.password);
      if (!passwordValidate) {
        res.status(404).json({
          message: 'Email Atau Password Salah',
        });
        return;
      }
      const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
      const token = jwt.sign(
        {
          id: user.id,
        },
        jwtSecretKey,
        { expiresIn: '1d' },
      );

      const { password: unUsedPassword, ...userResponse } = user;

      res.status(200).json({
        message: 'Login Success',
        data: { user: userResponse, token },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/registerDTO"
                    }  
                }
            }
        } 
    */
    try {
      const body = req.body;
      const validateBody = await registerSchema.validateAsync(body);

      const isUsername = await authService.getDataByUsername(body.username);
      if (isUsername?.username) {
        res.status(400).json({ message: 'Username already in use ' });
        return;
      }

      const isEmail = await authService.getDataByEmail(body.email);
      if (isEmail?.email) {
        res.status(400).json({ message: 'email already in use ' });
        return;
      }

      const hashedPassword = await bcrypt.hash(validateBody.password, 10);

      const registerBody: RegisterDTO = {
        ...validateBody,
        password: hashedPassword,
      };

      const user = await authService.register(registerBody);
      res.status(200).json({ message: 'Success', data: user });
    } catch (error) {
      next(error);
    }
  }

  async authCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;

      const user = await userService.getUsersById(payload.id);

      if (!user) {
        res.status(404).json({
          message: 'User not found!',
        });
        return;
      }

      const { password: unusedPassword, ...userResponse } = user;

      res.status(200).json({ message: 'Success', data: { ...userResponse } });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/forgotPasswordDTO"
                    }  
                }
            }
        } 
    */
    try {
      const body = req.body;
      const { email } = await forgotPasswordSchema.validateAsync(body);
      const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
      const token = jwt.sign(
        {
          email,
        },
        jwtSecretKey,
        { expiresIn: '1d' },
      );

      const frontendUrl = process.env.FRONTEND_BASE_URL;
      const linkForgotPawword = `${frontendUrl}/resetpassword/?token=${token}`;

      const mailOptions = {
        from: 'circleapp@circle.com',
        to: email,
        subject: 'Circe | Forgot Password',
        html: `
          <h1>This is link for forgot password</h1>
          <a href='${linkForgotPawword}'>${linkForgotPawword}</a>
          `,
      };

      await transporter.sendMail(mailOptions);
      res.json({
        message: 'Forgot password link sent!',
      });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/resetPasswordDTO"
                    }  
                }
            }
        } 
    */
    try {
      const payload = (req as any).user;
      const body = req.body;

      const { oldPassword, newPassword } =
        await resetPasswordSchema.validateAsync(body);

      if (oldPassword !== newPassword) {
        res.status(400).json({
          message: 'password is not the same as confirm password',
        });
        return;
      }

      const user = await userService.getUserByEmail(payload.email);
      if (!user) {
        res.status(404).json({
          message: 'user not found',
        });
        return;
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        newPassword,
        user.password,
      );

      if (isOldPasswordCorrect) {
        res.status(400).json({
          message: 'Password cannot be the same as previous!',
        });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const updatePassword = await authService.resetPassword(
        user.email,
        hashedNewPassword,
      );

      res.status(200).json({ message: 'Success', updatePassword });
    } catch (error) {
      next(error);
    }
  }
  // async resetPassword(req: Request, res: Response, next: NextFunction) {
  //   /*  #swagger.requestBody = {
  //           required: true,
  //           content: {
  //               "application/json": {
  //                   schema: {
  //                       $ref: "#/components/schemas/resetPasswordDTO"
  //                   }
  //               }
  //           }
  //       }
  //   */
  //   try {
  //     const payload = (req as any).user;
  //     const body = req.body;

  //     const { oldPassword, newPassword } =
  //       await resetPasswordSchema.validateAsync(body);

  //     if (oldPassword === newPassword) {
  //       res.status(400).json({
  //         message: 'Password cannot be the same as previous!',
  //       });
  //       return;
  //     }
  //     const user = await userService.getUserByEmail(payload.email);

  //     if (!user) {
  //       res.status(404).json({
  //         message: 'user not found',
  //       });
  //       return;
  //     }

  //     const isOldPasswordCorrect = await bcrypt.compare(
  //       oldPassword,
  //       user.password,
  //     );

  //     if (!isOldPasswordCorrect) {
  //       res.status(400).json({
  //         message: 'user password is not correct',
  //       });
  //       return;
  //     }

  //     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  //     const updatePassword = await authService.resetPassword(
  //       user.email,
  //       hashedNewPassword,
  //     );

  //     res.status(200).json({ message: 'Success', updatePassword });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new authController();
