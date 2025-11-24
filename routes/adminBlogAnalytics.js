// // routes/analytics.js
// import express from "express";
// import Tracking from "../models/Tracking.js";
// import User from "../models/User.js";
// import Post from "../models/post.js";

// const router = express.Router();

// // Get dashboard analytics
// router.get("/dashboard", async (req, res) => {
//   try {
//     const monthStart = new Date();
//     monthStart.setDate(1);
//     monthStart.setHours(0,0,0,0);

//     const [users, posts, pageviews, clicks] = await Promise.all([
//       User.countDocuments({}), // total users
//       Post.countDocuments({}), // total posts
//       Tracking.countDocuments({ eventType: "pageview", createdAt: { $gte: monthStart } }),
//       Tracking.countDocuments({ eventType: "click", createdAt: { $gte: monthStart } })
//     ]);

//     // Group device usage
//     const devices = await Tracking.aggregate([
//       { $match: { createdAt: { $gte: monthStart } } },
//       { $group: { _id: "$deviceType", count: { $sum: 1 } } }
//     ]);

//     res.json({
//       users,
//       posts,
//       pageviews,
//       clicks,
//       devices,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import { getDashboard } from "../controllers/adminBlogAnlyticsController.js";

const router = express.Router();

// Route only defines endpoint, controller handles logic
router.get("/dashboard", getDashboard);


export default router;
