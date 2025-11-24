
import Post from "../models/post.js";
import Tag from "../models/tag.js";

// Create new Tag

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

    const tag = new Tag({ name: name.trim(), slug });
    await tag.save();

    res.status(201).json(tag);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Tag already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

  
// Get all tags with pagination
export const getTags = async (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const tags = await Tag.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Tag.countDocuments(filter);

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      tags,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update tag
export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name }, // only updating name for now
      { new: true, runValidators: true }
    );

    if (!tag) return res.status(404).json({ error: "Tag not found" });

    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete tag
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) return res.status(404).json({ error: "Tag not found" });

    // remove this tag from all posts
    await Post.updateMany(
      { tags: tag._id },
      { $pull: { tags: tag._id } }
    );

    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
