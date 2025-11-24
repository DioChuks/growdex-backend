// controllers/trackingController.js
import Tracking from "../models/Tracking.js";

// log page view
export const trackPageView = async (req, res) => {
  try {
    const tracking = new Tracking({
      eventType: "pageview",
      page: req.body.page,        // e.g. "/blog/ai-marketing"
      deviceType: req.body.deviceType || "web",
      userId: req.body.userId || null
    });
    await tracking.save();
    res.status(201).json({ message: "Pageview tracked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// log click
export const trackClick = async (req, res) => {
  try {
    const tracking = new Tracking({
      eventType: "click",
      page: req.body.page,        // e.g. "/blog"
      deviceType: req.body.deviceType || "web",
      userId: req.body.userId || null
    });
    await tracking.save();
    res.status(201).json({ message: "Click tracked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
