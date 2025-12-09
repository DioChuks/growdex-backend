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
