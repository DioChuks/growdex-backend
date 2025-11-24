// models/Tracking.js
import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
  eventType: { type: String, enum: ["click", "pageview", "post"], required: true },
  page: { type: String },  // e.g. "/blog/ai-marketing"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  deviceType: { type: String, enum: ["web", "mobile"], default: "web" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Tracking", trackingSchema);
