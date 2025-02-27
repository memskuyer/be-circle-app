import { v2 as cloudinary } from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const initCloudinary = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cloud_name = process.env.CLOUDINARY_NAME || '';
  const api_key = process.env.CLOUDINARY_API_KEY || '';
  const api_secret = process.env.CLOUDINARY_SECRET_KEY || '';
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret, // Click 'View API Keys' above to copy your API secret
  });
  next();
};
