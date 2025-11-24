// routes/track.js
import express from "express";
import { trackPageView, trackClick } from "../controllers/blogTrackingController.js";

const router = express.Router();

router.post("/pageview", trackPageView);
router.post("/click", trackClick);

export default router;
