import Stripe from "stripe";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";
import { sendMail } from "../nodeMailer/sendMail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map frontend plan IDs to Stripe price IDs
const PRICE_IDS = {
  basic: {
    monthly: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID,
    annually: process.env.STRIPE_BASIC_ANNUAL_PRICE_ID,
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    annually: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    annually: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID,
  },
};

// Create Stripe Checkout Session
// export const createCheckoutSession = async (req, res) => {
//   const { plan, billingCycle } = req.body;
//   const user = req.user;

//   if (!plan || !PRICE_IDS[plan])
//     return res.status(400).json({ error: "Invalid plan" });

//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: "subscription",
//       payment_method_types: ["card"],
//       customer_email: user.email,
//       line_items: [{ price: PRICE_IDS[plan][billingCycle], quantity: 1 }],
//       subscription_data: {
//         trial_period_days: plan === "business" ? 0 : 7, // business plan has no trial
//         metadata: { plan, billingCycle, userId: user._id.toString() },
//       },
//       success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/subscription`,
//     });

//     res.json({ checkoutUrl: session.url });
//   } catch (err) {
//     console.error("Stripe checkout error:", err);
//     res.status(500).json({ error: "Failed to create checkout session" });
//   }
// };

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  const { email, plan, billingCycle } = req.body;

  if (!plan || !PRICE_IDS[plan])
    return res.status(400).json({ error: "Invalid plan" });

  if (!billingCycle || !PRICE_IDS[plan][billingCycle])
    return res.status(400).json({ error: "Invalid billing cycle" });

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
 const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  payment_method_types: ["card"],
  customer_email: email,
  line_items: [{ price: PRICE_IDS[plan][billingCycle], quantity: 1 }],
  subscription_data: {
    ...(plan !== "business" && { trial_period_days: 7 }), // only add if not business
    metadata: { plan, billingCycle, email },
  },
success_url: `${process.env.CLIENT_URL}/onboarding-steps?step=4&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.CLIENT_URL}/subscription`,

});

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};


// Stripe Webhook handler
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
       req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

 const handleSubscriptionUpdate = async (subscription, email, eventType) => {
  try {
    const targetEmail = email || subscription.metadata?.email;
    if (!targetEmail) {
      console.error("No email in subscription/session metadata");
      return;
    }

    const user = await User.findOne({ email: subscription.metadata.email });
    if (!user) return;

    // Save subscription to DB
    user.subscription = {
      plan: subscription.metadata.plan,
      billingCycle: subscription.metadata.billingCycle,
      isSubscribed: subscription.status === "active",
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    };
    await user.save();

    // Optional: Save to Subscription collection
    await Subscription.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        plan: subscription.metadata.plan,
        billingCycle: subscription.metadata.billingCycle,
        status: subscription.status,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : null,
        nextBillingDate: subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : null,
      },
      { upsert: true, new: true }
    );

    // Send email notifications based on event type
    if (eventType === "subscription_activated" && subscription.status === "active") {
      await sendMail({
        email: targetEmail,
        subject: "Subscription Activated ✅",
        message: `<p>Hello ${user.name || ""},</p>
                  <p>Your subscription for the <b>${subscription.metadata.plan}</b> plan has been successfully activated.</p>
                  <p>Billing Cycle: ${subscription.metadata.billingCycle}</p>
                  <p>Thank you for subscribing!</p>`,
      });
    } else if (eventType === "payment_succeeded") {
      await sendMail({
        email: targetEmail,
        subject: "Payment Successful 💳",
        message: `<p>Hello ${user.name || ""},</p>
                  <p>Your payment for the <b>${subscription.metadata.plan}</b> plan was successful.</p>
                  <p>Thank you!</p>`,
      });
    } else if (eventType === "payment_failed") {
      await sendMail({
        email: targetEmail,
        subject: "Payment Failed ⚠️",
        message: `<p>Hello ${user.name || ""},</p>
                  <p>Unfortunately, your payment for the <b>${subscription.metadata.plan}</b> plan failed.</p>
                  <p>Please update your payment method to avoid service interruption.</p>`,
      });
    }
  } catch (err) {
    console.error("Failed to update subscription:", err);
  }
};


  try {
  switch (event.type) {
 case "checkout.session.completed":
  const session = event.data.object;
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    const email = session.customer_email || subscription.metadata.email;
    await handleSubscriptionUpdate(subscription, email, "subscription_activated");
  }
  break;

case "invoice.payment_succeeded":
  await handleSubscriptionUpdate(event.data.object, event.data.object.metadata?.email, "payment_succeeded");
  break;

case "invoice.payment_failed":
  await handleSubscriptionUpdate(event.data.object, event.data.object.metadata?.email, "payment_failed");
  break;

case "customer.subscription.created":
case "customer.subscription.updated":
case "customer.subscription.deleted":
  const subscription = event.data.object;
  const email = subscription.metadata?.email;
  await handleSubscriptionUpdate(subscription, email, "subscription_activated");
  break;

  default:
    console.log(`Unhandled event type ${event.type}`);
}


    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    res.status(500).send("Internal server error");
  }
};

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  res.json({
    status: user.subscription?.isSubscribed
      ? user.subscription.subscriptionStatus
      : user.subscription?.trialEnd
      ? "trialing"
     : null,  // <-- no "free" anymore
    trialEnd: user.subscription?.trialEnd || null,
    plan: user.subscription?.plan || null,
    billingCycle: user.subscription?.billingCycle || "monthly",
    currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
  });
};

export const verifySession = async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) return res.status(400).json({ success: false, message: "Missing session_id" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Optionally also retrieve subscription for extra verification
    const subscription = session.subscription
      ? await stripe.subscriptions.retrieve(session.subscription)
      : null;

    if (session.payment_status === "paid" || subscription?.status === "active") {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, message: "Payment not completed" });
    }
  } catch (err) {
    console.error("Stripe verify session error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
