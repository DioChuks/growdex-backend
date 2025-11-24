import express from "express";
import { createCheckoutSession, stripeWebhook, getSubscriptionStatus, verifySession } from "../controllers/subscriptionController.js";


const router = express.Router();


// Get current subscription status
router.get("/subscription-status", getSubscriptionStatus);
// Create Stripe Checkout session
router.post("/checkout-session", createCheckoutSession);

router.get("/stripe/verify-session", verifySession);

// // Stripe Webhook endpoint (no auth!)
// router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Get current subscription status
router.get("/subscription-status", getSubscriptionStatus);

export default router;
