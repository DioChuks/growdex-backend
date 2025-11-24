// middleware/tracker.js
import Tracking from "../models/Tracking.js";

export const trackPageView = async (req, res, next) => {
  try {
    await Tracking.create({
      eventType: "pageview",
      page: req.originalUrl,
      userId: req.user?._id || null,
      deviceType: req.headers["user-agent"].includes("Mobile") ? "mobile" : "web",
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
  next();
};
