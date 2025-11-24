import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  stripeCustomerId: { type: String, required: true },
  stripeSubscriptionId: { type: String },
  plan: { type: String },
  billingCycle: { type: String, enum: ["monthly", "annually"], default: "monthly" },
  status: { type: String, enum: ["trialing", "active", "past_due", "canceled"], default: "trialing" },
  trialEnd: Date,
  currentPeriodEnd: Date, // For recurring billing
}, { timestamps: true });


export default mongoose.model("Subscription", subscriptionSchema);
