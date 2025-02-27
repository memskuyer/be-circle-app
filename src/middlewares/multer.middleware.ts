// import multer from 'multer';
// import path from 'path';

// const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './tmp/images');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname),
//     );
//   },
// });

// export const uploadImage = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (!whitelist.includes(file.mimetype)) {
//       return cb(new Error('file is not allowed'));
//     }

//     cb(null, true);
//   },
// });

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET_KEY as string,
});

// Set up multer storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    // folder: 'projects', // Specify folder if needed
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  } as unknown as { allowed_formats: string[] }, // Explicit type assertion
});

const upload = multer({ storage: storage });

module.exports = upload;
