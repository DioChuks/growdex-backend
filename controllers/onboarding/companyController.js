import CompanySetup from "../../models/Onboarding/Onboarding.js";
import OnboardingOption from "../../models/Onboarding/OnboardingOptions.js";

// Create company draft
export const createCompany = async (req, res) => {
  try {
    const { isCompleted, ...safeData } = req.body;
    const company = await CompanySetup.create(safeData);
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update company draft
export const updateCompany = async (req, res) => {
  try {
    const { isCompleted, ...safeData } = req.body;
    const company = await CompanySetup.findByIdAndUpdate(
      req.params.id,
      safeData,
      { new: true }
    );
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get saved company draft
export const getCompany = async (req, res) => {
  try {
    const company = await CompanySetup.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get onboarding options
export const getOnboardingOptions = async (req, res) => {
  try {
    const options = await OnboardingOption.findOne();
    if (!options) return res.status(404).json({ error: "Options not found" });
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
