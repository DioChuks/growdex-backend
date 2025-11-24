import mongoose from "mongoose";
import dotenv from "dotenv";
import OnboardingOption from "../models/Onboarding/OnboardingOptions.js";

dotenv.config();

const options = {
  industries: ["Technology", "Finance", "Healthcare", "Retail", "Education", "Manufacturing", "Other"],
  budgets: ["$500", "$1,000", "$2,500", "$5,000+"],
};

const seedOptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Delete old options
    await OnboardingOption.deleteMany({});
    // Insert new options
    const doc = await OnboardingOption.create(options);
    console.log("✅ Onboarding options seeded:", doc);
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seedOptions();
