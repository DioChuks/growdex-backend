import Post from "../models/post.js";

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
