// models/OnboardingOption.js
import mongoose from "mongoose";

const onboardingOptionSchema = new mongoose.Schema({
  industries: [String],
  budgets: [String],
});

export default mongoose.model("OnboardingOption", onboardingOptionSchema);
