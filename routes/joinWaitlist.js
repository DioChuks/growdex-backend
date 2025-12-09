import Router from "express";
import { appConfig } from "../config.js";
import MailerLite from '@mailerlite/mailerlite-nodejs';
import { checkApiKey } from "../middleware/waitlist.js";
import { waitlistLimiter } from "../middleware/rateLimiters.js";
import { isValidEmail } from "../utils/helpers.js";

const mailerlite = new MailerLite({
  api_key: appConfig.mailerLiteApiKey
});

const jwRouter = Router();

jwRouter.post("/join-waitlist", waitlistLimiter, checkApiKey, async (req, res) => {
  const { email, firstName } = req.body

  if (!email || !firstName) {
    return res.status(400).json({ message: "Email and firstName are required"})
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" })
  }

  const params = {
    email,
    fields: {
      name: firstName
    },
    groups: [appConfig.mailerLiteGroupId]
  };

  try {
    await mailerlite.subscribers.createOrUpdate(params);
    res.status(200).json({ message: "✅ Joined successfully" });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    res.status(500).json({ message: "❌ Failed to join!", error: error.response.data })
  }
})

export default jwRouter;
