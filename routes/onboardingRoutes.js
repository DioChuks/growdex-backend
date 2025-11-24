// routes/onboardingRoutes.js
import express from "express";
import User from "../models/User.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Update step
router.put("/onboarding/step", verifyToken, async (req, res) => {
  try {
    const { step } = req.body;

    const user = await User.findByIdAndUpdate(
        req.userId, 
      { currentStep: step },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complete onboarding
router.patch("/onboarding/complete", verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { onboardingCompleted: true },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
