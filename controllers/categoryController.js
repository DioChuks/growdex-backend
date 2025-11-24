import Category from "../models/category.js";
import Post from "../models/post.js";

// Create new category
export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: "Category already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all categories with pagination
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await Category.countDocuments(filter);

    const categories = await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      categories,     
      total,          
      page,           
      totalPages: Math.ceil(total / limit), 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name }, // only updating name for now
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) return res.status(404).json({ error: "Category not found" });

    // remove this category from all posts
    await Post.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } }
    );

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
