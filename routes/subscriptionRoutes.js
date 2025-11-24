// routes/subscription.js
import express from "express";
import { getSubscriptionStatus, createCheckoutSession, stripeWebhook } from "../controllers/subscriptionController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Protected route to get user subscription status
router.get("/status", verifyToken, getSubscriptionStatus);

// Create checkout session
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Stripe webhook (no auth needed)
router.post("/webhook", stripeWebhook);

export default router;
