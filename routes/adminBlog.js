import express from "express";
import { login, refresh, logout, getMe, updateProfileImage } from "../controllers/adminBlog.js";
import { requireAdminAuth } from "../middleware/adminBlogMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAdminAuth, getMe);
router.post("/profile/image", requireAdminAuth, upload.single("image"), updateProfileImage);

export default router;
