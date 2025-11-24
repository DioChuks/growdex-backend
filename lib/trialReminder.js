import cron from "node-cron";
import Subscription from "../models/Subscription.js"; // adjust path
import User from "../models/User.js";
import { sendMail } from "../nodeMailer/sendMail.js"; // adjust path

// Run every day at 9 AM server time
cron.schedule("0 9 * * *", async () => {
  console.log("Checking for users with trial ending soon...");

  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);

    // Find subscriptions with trial ending in 3 days
    const subscriptions = await Subscription.find({
      trialEnd: { $gte: today, $lte: threeDaysLater },
      status: "trialing", // optional: only if you have a 'trialing' status
    });

    for (const sub of subscriptions) {
      const user = await User.findById(sub.userId);
      if (!user) continue;

      await sendMail({
        email: user.email,
        subject: "Your trial is ending soon ⏳",
        message: `<p>Hello ${user.name || ""},</p>
                  <p>Your free trial for the <b>${sub.plan}</b> plan is ending on <b>${sub.trialEnd.toDateString()}</b>.</p>
                  <p>To continue uninterrupted access, please make sure your payment method is updated.</p>
                  <p>Thank you!</p>`,
      });

      console.log(`Trial reminder sent to ${user.email}`);
    }
  } catch (err) {
    console.error("Error sending trial reminders:", err);
  }
});
