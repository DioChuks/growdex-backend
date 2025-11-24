import express from "express";
import { 
  createCompany, 
  updateCompany, 
  getCompany, 
  getOnboardingOptions 
} from "../../controllers/onboarding/companyController.js";

const router = express.Router();
// Fetch onboarding dropdown options
router.get("/options", getOnboardingOptions);

// Company setup routes
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.get("/:id", getCompany);



export default router;
