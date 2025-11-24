// routes/upload.js
import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/postController.js";


const router = express.Router();

// just parse file uploads, don't store long-term
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), uploadImage);

export default router;
