import express from "express";
import {
  getPublicPosts,
} from "../controllers/postController.js";


const router = express.Router();

// Public routes after
router.get("/public", getPublicPosts);

export default router;
