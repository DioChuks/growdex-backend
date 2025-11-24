// // import multer from 'multer';
// // import { CloudinaryStorage } from 'multer-storage-cloudinary';
// // import cloudinary from '../config/cloudinary.js';

// // const storage = new CloudinaryStorage({
// //   cloudinary,
// //   params: {
// //     folder: 'blog_posts', // Cloudinary folder name
// //     allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
// //   }
// // });

// // const upload = multer({ storage });

// // export default upload;


// import multer from "multer";
// import path from "path";

// // Multer storage to temp folder (Cloudinary will handle hosting)
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// };

// export default multer({ storage, fileFilter });


import multer from "multer";
import path from "path";

// Multer storage to temp folder (Cloudinary will handle hosting)
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

// Multer instance
const upload = multer({ storage, fileFilter });

// Middleware to handle multiple fields
export const uploadPostImages = upload.fields([
  { name: "featuredImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

export default upload;
