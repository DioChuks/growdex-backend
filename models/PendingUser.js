// models/PendingUser.js
import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: false, minlength: 6 },
  verificationToken: { type: String, required: true },
  verificationTokenExpiresAt: { type: Date, required: true },
  resendCount: { type: Number, default: 0 },      // Track number of resend attempts
  lastResendAt: { type: Date },                  // Timestamp of last resend
}, { timestamps: true });

// TTL index — MongoDB will automatically delete the document when verificationTokenExpiresAt is reached
pendingUserSchema.index({ verificationTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("PendingUser", pendingUserSchema);
