// scripts/checkData.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // so it reads your .env file

// Example schemas (use the same ones you already defined in your project)
import User from "../models/User.js";
import Post from "../models/post.js";
import Tracking from "../models/Tracking.js";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB Atlas");

    // Fetch collections
    const users = await User.find().limit(5);      // first 5 users
    const posts = await Post.find().limit(5);      // first 5 posts
    const trackings = await Tracking.find().limit(5); // first 5 tracking logs

    console.log("Users:", users);
    console.log("Posts:", posts);
    console.log("Trackings:", trackings);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
