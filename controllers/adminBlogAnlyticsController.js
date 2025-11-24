import Post from "../models/post.js";
import User from "../models/User.js";
import Tracking from "../models/Tracking.js";

export const getDashboard = async (req, res) => {
  try {
    const from = req.query.from
      ? new Date(req.query.from)
      : new Date(new Date().getFullYear(), 0, 1); // start of year
    const to = req.query.to
      ? new Date(req.query.to)
      : new Date(new Date().getFullYear() + 1, 0, 1); // start of next year

    // Current period stats
    const pageviews = await Tracking.countDocuments({ eventType: "pageview", createdAt: { $gte: from, $lt: to } });
    const clicks = await Tracking.countDocuments({ eventType: "click", createdAt: { $gte: from, $lt: to } });
    const postsCount = await Post.countDocuments({ createdAt: { $gte: from, $lt: to } });
    const monthlyUsers = await User.countDocuments({ createdAt: { $gte: from, $lt: to } });

    // Previous period
    const lastFrom = new Date(from);
    lastFrom.setMonth(lastFrom.getMonth() - 1);
    const lastTo = new Date(to);
    lastTo.setMonth(lastTo.getMonth() - 1);

    const lastPageviews = await Tracking.countDocuments({ eventType: "pageview", createdAt: { $gte: lastFrom, $lt: lastTo } });
    const lastClicks = await Tracking.countDocuments({ eventType: "click", createdAt: { $gte: lastFrom, $lt: lastTo } });
    const lastPosts = await Post.countDocuments({ createdAt: { $gte: lastFrom, $lt: lastTo } });
    const lastUsers = await User.countDocuments({ createdAt: { $gte: lastFrom, $lt: lastTo } });

    const change = (current, prev) => {
      if (!prev) return "+0%";
      const diff = ((current - prev) / prev) * 100;
      return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    // const topPosts = await Post.find({
    //   createdAt: { $gte: from, $lt: to },
    // })
    //   .sort({ commentsCount: -1 })
    //   .limit(3)
    //   .select("title createdAt categories commentsCount featuredImage image");

    // Aggregate traffic by month by month
    // const trafficDataRaw = await Tracking.aggregate([
    //   { $match: { createdAt: { $gte: from, $lt: to } } },
    //   { $group: { _id: { $month: "$createdAt" }, traffic: { $sum: 1 } } },
    //   { $sort: { _id: 1 } },
    // ]);

    // const trafficMap = {};
    // trafficDataRaw.forEach(item => {
    //   trafficMap[item._id] = item.traffic;
    // });

    // const trafficData = Array.from({ length: 12 }, (_, i) => {
    //     const monthNum = i + 1;
    //     const traffic = trafficMap[monthNum] || 0;
    //     const year = new Date().getFullYear();
    //     return {
    //       month: monthNum,
    //       traffic,
    //       date: new Date(year, monthNum - 1, 1), // first day of month
    //     };
    //   });

    // Cummulative of every month in a year
    // Aggregate traffic by month
const trafficDataRaw = await Tracking.aggregate([
  { $match: { createdAt: { $gte: from, $lt: to } } },
  { $group: { _id: { $month: "$createdAt" }, traffic: { $sum: 1 } } },
  { $sort: { "_id": 1 } },
]);

// Map month -> traffic
const trafficMap = {};
trafficDataRaw.forEach(item => {
  trafficMap[item._id] = item.traffic;
});

// Build cumulative traffic
let cumulative = 0;
const trafficData = Array.from({ length: 12 }, (_, i) => {
  const monthNum = i + 1;
  const monthlyTraffic = trafficMap[monthNum] || 0;
  cumulative += monthlyTraffic; // accumulate
  const year = new Date().getFullYear();
  return {
    month: monthNum,
    traffic: cumulative,  // cumulative total
    date: new Date(year, monthNum - 1, 1),
  };
});

      

    // Device data
    const deviceDataRaw = await Tracking.aggregate([
      { $group: { _id: "$deviceType", value: { $sum: 1 } } },
    ]);
    // Always return both "web" and "mobile"
const deviceTypes = ["web", "mobile"];
const deviceData = deviceTypes.map(type => {
  const found = deviceDataRaw.find(d => d._id === type);
  return {
    name: type,
    value: found ? found.value : 0,
  };
});

    res.json({
      range: { from, to },
      stats: [
        { title: "Pageviews", value: pageviews, change: change(pageviews, lastPageviews) },
        { title: "Monthly users", value: monthlyUsers, change: change(monthlyUsers, lastUsers) },
        { title: "Posts", value: postsCount, change: change(postsCount, lastPosts) },
        { title: "Clicks", value: clicks, change: change(clicks, lastClicks) },
      ],
      trafficData,
      // topPosts,
      deviceData,
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};


// // Aggregate daily
// import Post from "../models/post.js";
// import User from "../models/User.js";
// import Tracking from "../models/Tracking.js";

// export const getDashboard = async (req, res) => {
//   try {
//     const from = req.query.from
//       ? new Date(req.query.from)
//       : new Date(new Date().getFullYear(), 0, 1); // start of year
//     const to = req.query.to
//       ? new Date(req.query.to)
//       : new Date(new Date().getFullYear() + 1, 0, 1); // start of next year

//     // Current period stats
//     const pageviews = await Tracking.countDocuments({ eventType: "pageview", createdAt: { $gte: from, $lt: to } });
//     const clicks = await Tracking.countDocuments({ eventType: "click", createdAt: { $gte: from, $lt: to } });
//     const postsCount = await Post.countDocuments({ createdAt: { $gte: from, $lt: to } });
//     const monthlyUsers = await User.countDocuments({ createdAt: { $gte: from, $lt: to } });

//     // Previous period
//     const lastFrom = new Date(from);
//     lastFrom.setMonth(lastFrom.getMonth() - 1);
//     const lastTo = new Date(to);
//     lastTo.setMonth(lastTo.getMonth() - 1);

//     const lastPageviews = await Tracking.countDocuments({ eventType: "pageview", createdAt: { $gte: lastFrom, $lt: lastTo } });
//     const lastClicks = await Tracking.countDocuments({ eventType: "click", createdAt: { $gte: lastFrom, $lt: lastTo } });
//     const lastPosts = await Post.countDocuments({ createdAt: { $gte: lastFrom, $lt: lastTo } });
//     const lastUsers = await User.countDocuments({ createdAt: { $gte: lastFrom, $lt: lastTo } });

//     const change = (current, prev) => {
//       if (!prev) return "+0%";
//       const diff = ((current - prev) / prev) * 100;
//       return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
//     };

//     const topPosts = await Post.find({
//       createdAt: { $gte: from, $lt: to },
//     })
//       .sort({ commentsCount: -1 })
//       .limit(3)
//       .select("title createdAt category commentsCount");

//     // Aggregate traffic by day
//     const trafficDataRaw = await Tracking.aggregate([
//         { $match: { createdAt: { $gte: from, $lt: to } } },
//         {
//           $group: {
//             _id: {
//               year: { $year: "$createdAt" },
//               month: { $month: "$createdAt" },
//               day: { $dayOfMonth: "$createdAt" }
//             },
//             traffic: { $sum: 1 }
//           }
//         },
//         { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
//       ]);


//     // const trafficMap = {};
//     // trafficDataRaw.forEach(item => {
//     //   trafficMap[item._id] = item.traffic;
//     // });

//    const trafficData = trafficDataRaw.map(item => ({
//   date: new Date(item._id.year, item._id.month - 1, item._id.day),
//   traffic: item.traffic
// }));

//     // Device data
//     const deviceDataRaw = await Tracking.aggregate([
//       { $group: { _id: "$deviceType", value: { $sum: 1 } } },
//     ]);
//     const deviceData = deviceDataRaw.map(d => ({
//       name: d._id,
//       value: d.value,
//     }));

//     res.json({
//       range: { from, to },
//       stats: [
//         { title: "Pageviews", value: pageviews, change: change(pageviews, lastPageviews) },
//         { title: "Monthly users", value: monthlyUsers, change: change(monthlyUsers, lastUsers) },
//         { title: "Posts", value: postsCount, change: change(postsCount, lastPosts) },
//         { title: "Clicks", value: clicks, change: change(clicks, lastClicks) },
//       ],
//       trafficData,
//       topPosts,
//       deviceData,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to load dashboard" });
//   }
// };
