import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    // What happened
    eventType: {
      type: String,
      enum: ["pageview", "click", "login", "logout", "custom"],
      default: "pageview",
    },

    // Where it happened
    page: { type: String }, // e.g. "/blog/ai-marketing"

    // Device/browser info
    device: { type: String, enum: ["mobile", "web"], required: true },
    browser: { type: String },
    os: { type: String },
    userAgent: { type: String },

    // Who did it (optional)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sessionId: { type: String, index: true },

    // Network
    ip: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed }, // any extra fields if needed
  },
  { timestamps: true }
);

// Helpful indexes for analytics
logSchema.index({ createdAt: -1 });
logSchema.index({ device: 1, createdAt: -1 });
logSchema.index({ eventType: 1, createdAt: -1 });

export default mongoose.model("Log", logSchema);
