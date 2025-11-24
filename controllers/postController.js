// // // import Post from "../models/post.js";

// // // // @desc    Get all posts
// // // export const getPosts = async (req, res) => {
// // //   try {
// // //     const posts = await Post.find().sort({ createdAt: -1 });
// // //     res.json(posts);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // @desc    Get single post by slug
// // // export const getPost = async (req, res) => {
// // //   try {
// // //     const post = await Post.findOne({ slug: req.params.slug });
// // //     if (!post) return res.status(404).json({ message: "Post not found" });
// // //     res.json(post);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // // // @desc    Create new post with optional Cloudinary image
// // // export const createPost = async (req, res) => {
// // //     try {
// // //       const post = new Post({
// // //         title: req.body.title,
// // //         body: req.body.body,
// // //         author: req.body.author,
// // //         tags: req.body.tags ? req.body.tags.split(',') : [],
// // //         slug: req.body.slug,
// // //         image: req.file?.path || null // Cloudinary URL if uploaded
// // //       });
  
// // //       await post.save();
// // //       res.status(201).json(post);
// // //     } catch (err) {
// // //       res.status(400).json({ message: err.message });
// // //     }
// // //   };
  

// // // // @desc    Update post
// // // export const updatePost = async (req, res) => {
// // //   try {
// // //     const post = await Post.findOneAndUpdate(
// // //       { slug: req.params.slug },
// // //       req.body,
// // //       { new: true }
// // //     );
// // //     if (!post) return res.status(404).json({ message: "Post not found" });
// // //     res.json(post);
// // //   } catch (err) {
// // //     res.status(400).json({ message: err.message });
// // //   }
// // // };

// // // // @desc    Delete post
// // // export const deletePost = async (req, res) => {
// // //   try {
// // //     const post = await Post.findOneAndDelete({ slug: req.params.slug });
// // //     if (!post) return res.status(404).json({ message: "Post not found" });
// // //     res.json({ message: "Post deleted" });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // };

// // import Post from "../models/post.js";
// // import cloudinary from "../config/cloudinary.js"; // needs config/cloudinary.js

// // // @desc    Get all posts
// // export const getPosts = async (req, res) => {
// //   try {
// //     const posts = await Post.find().sort({ createdAt: -1 });
// //     res.json(posts);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // @desc    Get single post by slug
// // export const getPost = async (req, res) => {
// //   try {
// //     const post = await Post.findOne({ slug: req.params.slug });
// //     if (!post) return res.status(404).json({ message: "Post not found" });
// //     res.json(post);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };

// // // @desc    Create new post with optional Cloudinary image
// // export const createPost = async (req, res) => {
// //   try {
// //     let imageUrl = null;
// //     let imagePublicId = null;

// //     if (req.file) {
// //       const result = await cloudinary.uploader.upload(req.file.path, {
// //         folder: "blog_posts",
// //       });
// //       imageUrl = result.secure_url;
// //       imagePublicId = result.public_id;
// //     }

// //     const post = new Post({
// //       title: req.body.title,
// //       body: req.body.body,
// //       author: req.body.author,
// //       tags: req.body.tags ? req.body.tags.split(",") : [],
// //       slug: req.body.slug,
// //       image: imageUrl,
// //       imagePublicId,
// //     });

// //     await post.save();
// //     res.status(201).json(post);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // // @desc    Update post (replace Cloudinary image if provided)
// // export const updatePost = async (req, res) => {
// //   try {
// //     const post = await Post.findOne({ slug: req.params.slug });
// //     if (!post) return res.status(404).json({ message: "Post not found" });

// //     let updatedData = { ...req.body };

// //     if (req.file) {
// //       // Delete old image if it exists
// //       if (post.imagePublicId) {
// //         await cloudinary.uploader.destroy(post.imagePublicId);
// //       }

// //       const result = await cloudinary.uploader.upload(req.file.path, {
// //         folder: "blog_posts",
// //       });
// //       updatedData.image = result.secure_url;
// //       updatedData.imagePublicId = result.public_id;
// //     }

// //     const updatedPost = await Post.findOneAndUpdate(
// //       { slug: req.params.slug },
// //       updatedData,
// //       { new: true }
// //     );

// //     res.json(updatedPost);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // // @desc    Delete post and Cloudinary image
// // export const deletePost = async (req, res) => {
// //   try {
// //     const post = await Post.findOneAndDelete({ slug: req.params.slug });
// //     if (!post) return res.status(404).json({ message: "Post not found" });

// //     // Remove image from Cloudinary if exists
// //     if (post.imagePublicId) {
// //       await cloudinary.uploader.destroy(post.imagePublicId);
// //     }

// //     res.json({ message: "Post deleted" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// import Post from "../models/post.js";
// import cloudinary from "../config/cloudinary.js";

// // Helper: Validate required fields
// const validatePost = (data) => {
//   const errors = [];
//   if (!data.title || data.title.trim() === "") errors.push("Title is required");
//   if (!data.author || data.author.trim() === "") errors.push("Author is required");
//   if (!data.body || data.body.trim() === "") errors.push("Body content is required");
//   return errors;
// };

// // @desc    Get all posts with optional pagination & tag filtering
// export const getPosts = async (req, res) => {
//   try {
//     let { page = 1, limit = 10, tags } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const filter = tags ? { tags: { $in: tags.split(",") } } : {};

//     const posts = await Post.find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await Post.countDocuments(filter);

//     res.json({
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       posts,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // @desc    Get single post by slug
// export const getPost = async (req, res) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug });
//     if (!post) return res.status(404).json({ message: "Post not found" });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // @desc    Create new post with optional Cloudinary image
// export const createPost = async (req, res) => {
//   try {
//     const errors = validatePost(req.body);
//     if (errors.length > 0) return res.status(400).json({ message: errors.join(", ") });

//     let imageUrl = null;
//     let imagePublicId = null;

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog_posts" });
//       imageUrl = result.secure_url;
//       imagePublicId = result.public_id;
//     }

//     const post = new Post({
//       title: req.body.title,
//       body: req.body.body,
//       author: req.body.author,
//       tags: req.body.tags ? req.body.tags.split(",") : [],
//       slug: req.body.slug,
//       image: imageUrl,
//       imagePublicId,
//     });

//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // @desc    Update post (replace Cloudinary image if provided)
// export const updatePost = async (req, res) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug });
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // Validate updated fields if present
//     if (req.body.title || req.body.author || req.body.body) {
//       const errors = validatePost({ ...post.toObject(), ...req.body });
//       if (errors.length > 0) return res.status(400).json({ message: errors.join(", ") });
//     }

//     let updatedData = { ...req.body };

//     if (req.file) {
//       if (post.imagePublicId) await cloudinary.uploader.destroy(post.imagePublicId);
//       const result = await cloudinary.uploader.upload(req.file.path, { folder: "blog_posts" });
//       updatedData.image = result.secure_url;
//       updatedData.imagePublicId = result.public_id;
//     }

//     const updatedPost = await Post.findOneAndUpdate({ slug: req.params.slug }, updatedData, { new: true });
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // @desc    Delete post and Cloudinary image
// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findOneAndDelete({ slug: req.params.slug });
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (post.imagePublicId) await cloudinary.uploader.destroy(post.imagePublicId);
//     res.json({ message: "Post deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// import Post from "../models/post.js";
// import cloudinary from "../config/cloudinary.js";
// import mongoose from "mongoose";
// import Category from "../models/category.js";
// import Tag from "../models/tag.js";


// // Validation helper
// const validatePost = (data) => {
//   const errors = [];
//   if (!data.title || data.title.trim() === "") errors.push("Title is required");
//   if (!data.author || data.author.trim() === "") errors.push("Author is required");
//   if (!data.body || data.body.trim() === "") errors.push("Body content is required");
//   return errors;
// };

// // @desc Get all posts with pagination, tag filter, search & sort
// export const getPosts = async (req, res) => {
//   try {
//     let { page = 1, limit = 10, tags, sortBy = "newest", search } = req.query;
//     page = parseInt(page);
//     limit = parseInt(limit);

//     const filter = {};
//     if (tags) filter.tags = { $in: tags.split(",") };
//     // if (category) filter.categories = { $in: category.split(",") };

//     if (search) filter.$or = [
//       { title: { $regex: search, $options: "i" } },
//       { body: { $regex: search, $options: "i" } }
//     ];

//     let sortOption;
//     switch (sortBy) {
//       case "oldest":
//         sortOption = { createdAt: 1 };
//         break;
//       case "popularity":
//         sortOption = { popularity: -1 };
//         break;
//       case "newest":
//       default:
//         sortOption = { createdAt: -1 };
//         break;
//     }

//     const posts = await Post.find(filter)
//     .populate("categories", "name slug").populate("tags", "name slug")
//       .sort(sortOption)
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const total = await Post.countDocuments(filter);

//     res.json({
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       posts,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // @desc Get single post by slug and increment popularity
// export const getPost = async (req, res) => {
//     try {
//       const post = await Post.findOneAndUpdate(
//         { slug: req.params.slug },
//         { $inc: { popularity: 1 } }, // increment popularity
//         { new: true } // return the updated document
//       ).populate("categories", "name slug").populate("tags", "name slug");;
  
//       if (!post) return res.status(404).json({ message: "Post not found" });
  
//       res.json(post);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };
  

// // @desc Create post with featuredImage & multiple images
// export const createPost = async (req, res) => {
//     try {
//       const errors = validatePost(req.body);
//       console.log("Incoming body:", req.body);

//       if (errors.length) return res.status(400).json({ message: errors.join(", ") });
  
//       let featuredImageObj = null;
//       const imagesArray = [];

//     // ---- Parse categories ----
//     let categories = [];

  

// // ...
// if (req.body.categories) {
//   try {
//     categories = JSON.parse(req.body.categories);
//     if (!Array.isArray(categories)) categories = [categories];
//   } catch {
//     categories = String(req.body.categories)
//       .split(",")
//       .map(c => c.trim())
//       .filter(Boolean);
//   }
// }
// const categoryIds = await Promise.all(
//   categories.map(async (nameOrId) => {
//     if (mongoose.Types.ObjectId.isValid(nameOrId)) {
//       // if valid ObjectId, check if category exists
//       let category = await Category.findById(nameOrId);
//       if (category) return category._id;
//     }
//     // fallback: treat as name, create if missing
//     let category = await Category.findOne({ name: nameOrId });
//     if (!category) {
//       category = await Category.create({ name: nameOrId });
//     }
//     return category._id;
//   })
// );


//     let tags = [];
//     if (req.body.tags) {
//       try {
//         tags = JSON.parse(req.body.tags);
//         if (!Array.isArray(tags)) tags = [tags];
//       } catch {
//         tags = String(req.body.tags)
//           .split(",")
//           .map(c => c.trim())
//           .filter(Boolean);
//       }
//     }
//     const tagIds = await Promise.all(
//       tags.map(async (nameOrId) => {
//         if (mongoose.Types.ObjectId.isValid(nameOrId)) {
//           let tag = await Tag.findById(nameOrId);
//           if (tag) return tag._id;
//         }
//         let tag = await Tag.findOne({ name: nameOrId });
//         if (!tag) tag = await Tag.create({ name: nameOrId });
//         return tag._id;
//       })
//     );
    
//     console.log("Parsed tags:", categories);
//     console.log("Parsed tags:", tags);
  
//       // Single featured image
//       if (req.files?.featuredImage) {
//         const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, { folder: "blog_posts" });
//         featuredImageObj = { url: result.secure_url, publicId: result.public_id };
//       }
  
//       // Multiple images
//       if (req.files?.images) {
//         for (let file of req.files.images) {
//           const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
//           imagesArray.push({ url: result.secure_url, publicId: result.public_id });
//         }
//       }

  
//       const post = new Post({
//         title: req.body.title,
//         body: req.body.body,
//         author: req.body.author,
//         categories: categoryIds,
//         tags: tagIds,

//         slug: req.body.slug,
//         featuredImage: featuredImageObj,
//         images: imagesArray,
//       });

  
//       await post.save();

//       const populatedPost = await Post.findById(post._id).populate("categories", "name slug").populate("tags", "name slug");
//       ;
  
//       console.log("Saved post doc:", populatedPost.toObject());
//       console.log("Saved categories field:", populatedPost.categories, populatedPost.tags);
  
//       res.status(201).json(populatedPost); // send only once
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   };

// // @desc Update post
// // export const updatePost = async (req, res) => {
// //   try {
// //     const post = await Post.findOne({ slug: req.params.slug });
// //     if (!post) return res.status(404).json({ message: "Post not found" });

// //     if (req.body.title || req.body.author || req.body.body) {
// //       const errors = validatePost({ ...post.toObject(), ...req.body });
// //       if (errors.length) return res.status(400).json({ message: errors.join(", ") });
// //     }

// //     const updatedData = { ...req.body };

// //     // Update featured image
// //     if (req.files?.featuredImage) {
// //       if (post.featuredImagePublicId) await cloudinary.uploader.destroy(post.featuredImagePublicId);
// //       const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, { folder: "blog_posts" });
// //       updatedData.featuredImage = result.secure_url;
// //       updatedData.featuredImagePublicId = result.public_id;
// //     }

// //     // Add multiple images
// //     if (req.files?.images) {
// //       const newImages = [];
// //       for (let file of req.files.images) {
// //         const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
// //         newImages.push({ url: result.secure_url, publicId: result.public_id });
// //       }
// //       updatedData.images = [...(post.images || []), ...newImages];
// //     }

// //     const updatedPost = await Post.findOneAndUpdate({ slug: req.params.slug }, updatedData, { new: true });
// //     res.json(updatedPost);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // };

// // @desc Update post with optional image addition/removal
// export const updatePost = async (req, res) => {
//     try {
//       const post = await Post.findOne({ slug: req.params.slug });
//       if (!post) return res.status(404).json({ message: "Post not found" });
  
//       // Validate required fields if they are being updated
//       if (req.body.title || req.body.author || req.body.body) {
//         const errors = validatePost({ ...post.toObject(), ...req.body });
//         if (errors.length) return res.status(400).json({ message: errors.join(", ") });
//       }
  
//       const updatedData = { ...req.body };
  
//       // --- Update featured image ---
//       if (req.files?.featuredImage) {
//         if (post.featuredImage?.publicId) {
//           await cloudinary.uploader.destroy(post.featuredImage.publicId);
//         }
//         const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, { folder: "blog_posts" });
//         updatedData.featuredImage = { url: result.secure_url, publicId: result.public_id };
//       }
  
//       // --- Add new multiple images ---
//       if (req.files?.images) {
//         const newImages = [];
//         for (let file of req.files.images) {
//           const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
//           newImages.push({ url: result.secure_url, publicId: result.public_id });
//         }
//         updatedData.images = [...(post.images || []), ...newImages];
//       }
  
//       // --- Remove selected images ---
//       // req.body.removeImages is expected to be an array of publicIds to remove
//       if (req.body.removeImages && Array.isArray(req.body.removeImages)) {
//         for (let publicId of req.body.removeImages) {
//           await cloudinary.uploader.destroy(publicId);
//         }
//         updatedData.images = (post.images || []).filter(img => !req.body.removeImages.includes(img.publicId));
//       }
  
//       const updatedPost = await Post.findOneAndUpdate(
//         { slug: req.params.slug },
//         updatedData,
//         { new: true }
//       );
  
//       res.json(updatedPost);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   };
  

// // @desc Delete post and all images
// // export const deletePost = async (req, res) => {
// //   try {
// //     const post = await Post.findOneAndDelete({ slug: req.params.slug });
// //     if (!post) return res.status(404).json({ message: "Post not found" });

// //     // Delete featured image
// //     if (post.featuredImagePublicId) await cloudinary.uploader.destroy(post.featuredImagePublicId);

// //     // Delete multiple images
// //     if (post.images && post.images.length > 0) {
// //       for (let img of post.images) {
// //         await cloudinary.uploader.destroy(img.publicId);
// //       }
// //     }

// //     res.json({ message: "Post deleted" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// // @desc Delete post and all images
// export const deletePost = async (req, res) => {
//     try {
//       const post = await Post.findOneAndDelete({ slug: req.params.slug });
//       if (!post) return res.status(404).json({ message: "Post not found" });
  
//       // Delete featured image
//       if (post.featuredImage?.publicId) {
//         await cloudinary.uploader.destroy(post.featuredImage.publicId);
//       }
  
//       // Delete multiple images
//       if (post.images && post.images.length > 0) {
//         for (let img of post.images) {
//           await cloudinary.uploader.destroy(img.publicId);
//         }
//       }
  
//       res.json({ message: "Post deleted" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // controllers/postController.js
// export const getPublicPosts = async (req, res) => {
//     try {
//       const posts = await Post.find({})
//       .populate("categories", "name").populate("tags", "name slug")
//         .sort({ createdAt: -1 }) // newest first
//         .limit(10);             // show top 10 posts
//       res.json(posts);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

//   // @desc    Toggle a single tag on a post (add on check, remove on uncheck)
// // body: { tag: string, selected: boolean }
// export const toggleTagOnPost = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const { tag, selected } = req.body;

//     if (!tag || typeof tag !== "string") {
//       return res.status(400).json({ message: "Valid 'tag' is required" });
//     }

//     // find or create Tag
//     let tagDoc = await Tag.findOne({ name: tag.trim() });
//     if (!tagDoc) {
//       tagDoc = await Tag.create({ name: tag.trim(), slug: tag.trim().toLowerCase().replace(/\s+/g, "-") });
//     }

//     const update = selected
//       ? { $addToSet: { tags: tagDoc._id } }  //  save ObjectId
//       : { $pull: { tags: tagDoc._id } };     //  remove ObjectId

//     const post = await Post.findOneAndUpdate({ slug }, update, { new: true })
//       .populate("categories", "name slug")
//       .populate("tags", "name slug");

//     if (!post) return res.status(404).json({ message: "Post not found" });

//     res.json({ tags: post.tags });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// changing Slug to id only in Admin


import Post from "../models/post.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

import Category from "../models/category.js";
import Tag from "../models/tag.js";
import slugify from "slugify";
import post from "../models/post.js";
import User from "../models/User.js";



// Validation helper
const validatePost = (data) => {
  const errors = [];
  if (!data.title || data.title.trim() === "") errors.push("Title is required");
  // if (!data.author || data.author.trim() === "") errors.push("Author is required");
  if (!data.body || data.body.trim() === "") errors.push("Body content is required");
  return errors;
};

// @desc Get all posts with pagination, tag filter, search & sort
export const getPosts = async (req, res) => {
  try {
    let { page = 1, limit = 10, tags, sortBy = "newest", search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (tags) {
         const tagSlugs = String(tags).split(",").map(t => t.trim()).filter(Boolean);
         const tagDocs = await Tag.find({ slug: { $in: tagSlugs } }).select("_id");
          filter.tags = { $in: tagDocs.map(t => t._id) };
        }
    // if (category) filter.categories = { $in: category.split(",") };

    if (search) filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { body: { $regex: search, $options: "i" } }
    ];

    let sortOption;
    switch (sortBy) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popularity":
        sortOption = { popularity: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const posts = await Post.find(filter)
    .populate("categories", "name slug").populate("tags", "name slug")
    .populate("author", "name avatar role")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single post by slug and increment popularity
export const getPost = async (req, res) => {
    try {
      const post = await Post.findOneAndUpdate(
        { slug: req.params.slug },
        { $inc: { popularity: 1 } }, // increment popularity
        { new: true } // return the updated document
      ).populate("categories", "name slug").populate("tags", "name slug") 
      .populate("author", "name avatar role") ;
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      res.json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  // @desc Get single post by ID (ADMIN, no popularity increment)
export const getPostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }
  
  try {
    const post = await Post.findById(req.params.id)
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name avatar role")
      
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    return res.status(400).json({ message: "Invalid post id" });
  }
};

  

// @desc Create post with featuredImage & multiple images
export const createPost = async (req, res) => {
    try {
      const errors = validatePost(req.body);
      console.log("Incoming body:", req.body);

      const baseSlug = slugify(req.body.slug || req.body.title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
  
      while (await Post.findOne({ slug })) {
        slug = `${baseSlug}-${counter++}`;
      }

      if (errors.length) return res.status(400).json({ message: errors.join(", ") });
  
      let featuredImageObj = null;
      const imagesArray = [];

    // ---- Parse categories ----
    let categories = [];

  

// ...
if (req.body.categories) {
  try {
    categories = JSON.parse(req.body.categories);
    if (!Array.isArray(categories)) categories = [categories];
  } catch {
    categories = String(req.body.categories)
      .split(",")
      .map(c => c.trim())
      .filter(Boolean);
  }
}
const categoryIds = await Promise.all(
  categories.map(async (nameOrId) => {
    if (mongoose.Types.ObjectId.isValid(nameOrId)) {
      // if valid ObjectId, check if category exists
      let category = await Category.findById(nameOrId);
      if (category) return category._id;
    }
    // fallback: treat as name, create if missing
    let category = await Category.findOne({ name: nameOrId });
    if (!category) {
      category = await Category.create({
           name: nameOrId,
           slug: slugify(String(nameOrId), { lower: true, strict: true })
         });
    }
    return category._id;
  })
);


    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
        if (!Array.isArray(tags)) tags = [tags];
      } catch {
        tags = String(req.body.tags)
          .split(",")
          .map(c => c.trim())
          .filter(Boolean);
      }
    }
    const tagIds = await Promise.all(
      tags.map(async (nameOrId) => {
        if (mongoose.Types.ObjectId.isValid(nameOrId)) {
          let tag = await Tag.findById(nameOrId);
          if (tag) return tag._id;
        }
        let tag = await Tag.findOne({ slug: slugify(String(nameOrId), { lower: true, strict: true }) });
         if (!tag) {
           tag = await Tag.create({
             name: nameOrId,
            slug: slugify(String(nameOrId), { lower: true, strict: true })
           });
       }
        return tag._id;
      })
    );
    
    console.log("Parsed tags:", categories);
    console.log("Parsed tags:", tags);
  
      // Single featured image
      if (req.files?.featuredImage) {
        const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, { folder: "blog_posts" });
        featuredImageObj = { url: result.secure_url, publicId: result.public_id };
      }
  
      // Multiple images
      if (req.files?.images) {
        for (let file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
          imagesArray.push({ url: result.secure_url, publicId: result.public_id });
        }
      }

     // **Fetch real user document**
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      author: req.user.sub,              // use real user
      categories: categoryIds,
      tags: tagIds,
      slug,
      featuredImage: featuredImageObj,
      images: imagesArray,
    });
  
      await post.save();

      const populatedPost = await Post.findById(post._id).populate("categories", "name slug").populate("author", "name avatar role");
      ;
  
      console.log("Saved post doc:", populatedPost.toObject());
      console.log("Saved categories field:", populatedPost.categories, populatedPost.tags);
  
      res.status(201).json(populatedPost); //  send only once
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

// @desc Update post
// export const updatePost = async (req, res) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug });
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     if (req.body.title || req.body.author || req.body.body) {
//       const errors = validatePost({ ...post.toObject(), ...req.body });
//       if (errors.length) return res.status(400).json({ message: errors.join(", ") });
//     }

//     const updatedData = { ...req.body };

//     // Update featured image
//     if (req.files?.featuredImage) {
//       if (post.featuredImagePublicId) await cloudinary.uploader.destroy(post.featuredImagePublicId);
//       const result = await cloudinary.uploader.upload(req.files.featuredImage[0].path, { folder: "blog_posts" });
//       updatedData.featuredImage = result.secure_url;
//       updatedData.featuredImagePublicId = result.public_id;
//     }

//     // Add multiple images
//     if (req.files?.images) {
//       const newImages = [];
//       for (let file of req.files.images) {
//         const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
//         newImages.push({ url: result.secure_url, publicId: result.public_id });
//       }
//       updatedData.images = [...(post.images || []), ...newImages];
//     }

//     const updatedPost = await Post.findOneAndUpdate({ slug: req.params.slug }, updatedData, { new: true });
//     res.json(updatedPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// @desc Update post with optional image addition/removal
// export const updatePost = async (req, res) => {
//     try {
//       const post = await Post.findOne({ slug: req.params.slug });
//       if (!post) return res.status(404).json({ message: "Post not found" });
  
//       // Validate required fields if they are being updated
//       if (req.body.title || req.body.author || req.body.body) {
//         const errors = validatePost({ ...post.toObject(), ...req.body });
//         if (errors.length) return res.status(400).json({ message: errors.join(", ") });
//       }
  
//       const updatedData = { ...req.body };
//   // --- Featured image (unchanged logic above this) ---

// // Normalize removeImages input
// let removeImages = req.body.removeImages;
// if (typeof removeImages === "string") {
//   try {
//     removeImages = JSON.parse(removeImages);
//   } catch {
//     removeImages = removeImages.split(",").map(s => s.trim()).filter(Boolean);
//   }
// }
// if (!Array.isArray(removeImages)) removeImages = [];

// let currentImages = Array.isArray(post.images) ? [...post.images] : [];

// // Remove selected images first
// if (removeImages.length) {
//   for (const publicId of removeImages) {
//     await cloudinary.uploader.destroy(publicId);
//   }
//   currentImages = currentImages.filter(img => !removeImages.includes(img.publicId));
// }

// // Add new images
// if (req.files?.images) {
//   const newImages = [];
//   for (const file of req.files.images) {
//     const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
//     newImages.push({ url: result.secure_url, publicId: result.public_id });
//   }
//   currentImages = [...currentImages, ...newImages];
// }

// updatedData.images = currentImages;

  
//       const updatedPost = await Post.findOneAndUpdate(
//         { slug: req.params.slug },
//         updatedData,
//         { new: true }
//       );
  
//       res.json(updatedPost);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   };
  
  // @desc Update post by ID (ADMIN, safe even if slug changes)
  export const updatePostById = async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid post id" });
      }
      
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });


      // Validate if key fields are updated
      if (req.body.title || req.body.author || req.body.body) {
        const errors = validatePost(req.body);
        if (errors.length) return res.status(400).json({ message: errors.join(", ") });
        
      }
  
      const updatedData = { ...req.body };
      if (!req.body.author) {
        const user = await User.findById(req.user.sub);
        if (user) {
          updatedData.author = user._id;

        }
      }
      
  
      // --- Slug handling ---
      if (req.body.slug && req.body.slug !== post.slug) {
        const baseSlug = slugify(req.body.slug || req.body.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;
        while (await Post.findOne({ slug, _id: { $ne: post._id } })) {
          slug = `${baseSlug}-${counter++}`;
        }
        updatedData.slug = slug;
      } else {
        delete updatedData.slug; // prevent accidental overwrite
      }
  
     // --- Featured image (unchanged logic above this) ---
// --- Featured image ---
if (req.files?.featuredImage) {
  if (post.featuredImage?.publicId) {
    await cloudinary.uploader.destroy(post.featuredImage.publicId);
  }
  const result = await cloudinary.uploader.upload(
    req.files.featuredImage[0].path,
    { folder: "blog_posts" }
  );
  updatedData.featuredImage = { url: result.secure_url, publicId: result.public_id };
}

// Normalize removeImages input
let removeImages = req.body.removeImages;
if (typeof removeImages === "string") {
  try {
    removeImages = JSON.parse(removeImages);
  } catch {
    removeImages = removeImages.split(",").map(s => s.trim()).filter(Boolean);
  }
}
if (!Array.isArray(removeImages)) removeImages = [];

let currentImages = Array.isArray(post.images) ? [...post.images] : [];

// Remove selected images first
if (removeImages.length) {
  for (const publicId of removeImages) {
    await cloudinary.uploader.destroy(publicId);
  }
  currentImages = currentImages.filter(img => !removeImages.includes(img.publicId));
}

// Add new images
if (req.files?.images) {
  const newImages = [];
  for (const file of req.files.images) {
    const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
    newImages.push({ url: result.secure_url, publicId: result.public_id });
  }
  currentImages = [...currentImages, ...newImages];
}

updatedData.images = currentImages;

  
      // // --- Add new multiple images ---
      // if (req.files?.images) {
      //   const newImages = [];
      //   for (let file of req.files.images) {
      //     const result = await cloudinary.uploader.upload(file.path, { folder: "blog_posts" });
      //     newImages.push({ url: result.secure_url, publicId: result.public_id });
      //   }
      //   updatedData.images = [...(post.images || []), ...newImages];
      // }
  
     
  
      // --- Categories update ---
      if (req.body.categories) {
        let categories = [];
        try {
          categories = JSON.parse(req.body.categories);
          if (!Array.isArray(categories)) categories = [categories];
        } catch {
          categories = String(req.body.categories)
            .split(",")
            .map(c => c.trim())
            .filter(Boolean);
        }
  
        const categoryIds = await Promise.all(
          categories.map(async (nameOrId) => {
            if (mongoose.Types.ObjectId.isValid(nameOrId)) {
              let category = await Category.findById(nameOrId);
              if (category) return category._id;
            }
            let category = await Category.findOne({ name: nameOrId });
            if (!category) category = await Category.create({ name: nameOrId });
            return category._id;
          })
        );
  
        updatedData.categories = categoryIds;
      }
  
      // --- Tags update ---
      if (req.body.tags) {
        let tags = [];
        try {
          tags = JSON.parse(req.body.tags);
          if (!Array.isArray(tags)) tags = [tags];
        } catch {
          tags = String(req.body.tags)
            .split(",")
            .map(c => c.trim())
            .filter(Boolean);
        }
  
        const tagIds = await Promise.all(
          tags.map(async (nameOrId) => {
            if (mongoose.Types.ObjectId.isValid(nameOrId)) {
              let tag = await Tag.findById(nameOrId);
              if (tag) return tag._id;
            }
            let tag = await Tag.findOne({ name: nameOrId });
            if (!tag) tag = await Tag.create({ name: nameOrId });
            return tag._id;
          })
        );
  
        updatedData.tags = tagIds;
      }
  
      // --- Save update ---
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true })
        .populate("categories", "name slug")
        .populate("tags", "name slug").populate("author", "name avatar role")
        ;
  
      res.json(updatedPost);
    } catch (err) {
      return res.status(400).json({ message: "Invalid post id" });
    }
  };
  
  
  

// @desc Delete post and all images
// export const deletePost = async (req, res) => {
//   try {
//     const post = await Post.findOneAndDelete({ slug: req.params.slug });
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     // Delete featured image
//     if (post.featuredImagePublicId) await cloudinary.uploader.destroy(post.featuredImagePublicId);

//     // Delete multiple images
//     if (post.images && post.images.length > 0) {
//       for (let img of post.images) {
//         await cloudinary.uploader.destroy(img.publicId);
//       }
//     }

//     res.json({ message: "Post deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// @desc Delete post and all images
// export const deletePost = async (req, res) => {
//     try {
//       const post = await Post.findOneAndDelete({ slug: req.params.slug });
//       if (!post) return res.status(404).json({ message: "Post not found" });
  
//       // Delete featured image
//       if (post.featuredImage?.publicId) {
//         await cloudinary.uploader.destroy(post.featuredImage.publicId);
//       }
  
//       // Delete multiple images
//       if (post.images && post.images.length > 0) {
//         for (let img of post.images) {
//           await cloudinary.uploader.destroy(img.publicId);
//         }
//       }
  
//       res.json({ message: "Post deleted" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };

  // @desc Delete post by ID (admin only)
export const deletePostById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid post id" });
  }
  
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete featured image
    if (post.featuredImage?.publicId) {
      await cloudinary.uploader.destroy(post.featuredImage.publicId);
    }

    // Delete multiple images
    if (post.images && post.images.length > 0) {
      for (let img of post.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


  // controllers/postController.js
  export const getPublicPosts = async (req, res) => {
    try {
      let { page = 1, limit = 14 } = req.query; // default 14 per request
      page = parseInt(page);
      limit = parseInt(limit);
  
      const posts = await Post.find({})
        .populate("categories", "name slug")
        .populate("tags", "name slug")
        .populate("author", "name avatar role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
  
      const total = await Post.countDocuments({});
      res.json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        posts,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  // @desc    Toggle a single tag on a post (add on check, remove on uncheck)
// body: { tag: string, selected: boolean }
export const toggleTagOnPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag, selected } = req.body;

    if (!tag || typeof tag !== "string") {
      return res.status(400).json({ message: "Valid 'tag' is required" });
    }

    // find or create Tag
     const norm = slugify(tag.trim(), { lower: true, strict: true });
     let tagDoc = await Tag.findOne({ slug: norm });
    if (!tagDoc) {
      tagDoc = await Tag.create({ name: tag.trim(), slug: norm });
    }

    const update = selected
      ? { $addToSet: { tags: tagDoc._id } }
      : { $pull: { tags: tagDoc._id } };

    const post = await Post.findByIdAndUpdate(id, update, { new: true })
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate("author", "name avatar role")

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ tags: post.tags });
  } catch (err) {
    return res.status(400).json({ message: "Invalid post id" });
  }
};


export const uploadImage = async (req, res) => {
  console.log("Incoming file:", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog_inline_images", // keep separate from featured images
    });

    return res.json({ url: result.secure_url }); 
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Image upload failed" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
    updates.avatar = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user.sub, updates, { new: true })

      .select("-password"); 

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed" });
  }
};



