import express from "express";
import { createCompany, updateCompany, getCompany } from "../../controllers/onboarding/companyController.js";

const router = express.Router();

router.post("/company-setup", createCompany);
router.put("/company-setup:id", updateCompany);
router.get("/company-setup:id", getCompany);

export default router;
