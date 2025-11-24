// import express from "express";
// import {
//   getPosts,
//   getPost,
//   createPost,
//   updatePost,
//   deletePost,
// } from "../controllers/postController.js";

// const router = express.Router();

// router.get("/", getPosts);
// router.get("/:slug", getPost);
// router.post("/", createPost);
// router.put("/:slug", updatePost);
// router.delete("/:slug", deletePost);

// export default router;


// import express from "express";
// import { uploadPostImages } from "../middleware/upload.js";
// import {
//   getPosts,
//   getPost,
//   createPost,
//   updatePost,
//   deletePost,
//   getPublicPosts,
//   toggleTagOnPost
// } from "../controllers/postController.js";
// import { requireAdminAuth } from "../middleware/adminBlogMiddleware.js";

// const router = express.Router();



// // Create new post (with featuredImage + multiple images)
// router.post("/", uploadPostImages, createPost);

// // Update post (with featuredImage + multiple images)
// router.put("/:slug", uploadPostImages, updatePost);

// // Delete post (also removes images from Cloudinary)
// router.delete("/:id",  requireAdminAuth, deletePost);

// // Public endpoint: latest 10 posts
// router.get("/public", getPublicPosts);

// // Get all posts
// router.get("/", getPosts);

// // Get single post
// router.get("/:slug", getPost);
// // PATCH /api/posts/:slug/tags
// router.patch("/:slug/tags", toggleTagOnPost);


// export default router;

import express from "express";
import { uploadPostImages } from "../middleware/upload.js";
import {
  getPosts,
  getPost,
  createPost,
 
  getPublicPosts,
  toggleTagOnPost,
  deletePostById,
  updatePostById,
  getPostById,
 
} from "../controllers/postController.js";
import { requireAdminAuth } from "../middleware/adminBlogMiddleware.js";


const router = express.Router();



// Admin routes first
router.post("/admin", requireAdminAuth, uploadPostImages, createPost);
router.put("/admin/:id", requireAdminAuth, uploadPostImages, updatePostById);
router.delete("/admin/:id", requireAdminAuth, deletePostById);
router.get("/admin/:id", requireAdminAuth, getPostById);
router.patch("/admin/:id/tags", requireAdminAuth, toggleTagOnPost);



// Public routes after
router.get("/public", getPublicPosts);
router.get("/", getPosts);
router.get("/:slug", getPost);

export default router;
