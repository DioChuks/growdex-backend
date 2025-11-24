// models/CompanySetup.js
import mongoose from "mongoose";

const companySetupSchema = new mongoose.Schema(
  {
    company: {
      companyName: { type: String, required: true },
      industry: { type: String, required: true },
      budget: { type: String, required: true },
    },
    plan: {
      selectedPlan: { type: String, default: "" },
    },
    billing: {
      cardNumber: { type: String, default: "" },
      expiry: { type: String, default: "" },
      cvc: { type: String, default: "" },
    },
    socialAuth: {
      google: { type: Boolean, default: false },
      github: { type: Boolean, default: false },
    },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("CompanySetup", companySetupSchema);
