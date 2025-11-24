import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Routes
import postRoutes from './routes/postRoutes.js';
import joinWaitlistRoute from './routes/joinWaitlist.js';
import adminRoutes from "./routes/adminBlog.js"; 
import adminBlogRoutes from "./routes/adminBlogAnalytics.js"; 
import trackRoutes from "./routes/adminBlogTrack.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import uploadRoutes from "./routes/upload.js";
import user from "./routes/userRoutes.js";

// Onboarding Routes
import companyRoutes from "./routes/onboarding/companyRoutes.js";
import planRoutes from "./routes/onboarding/planRoutes.js";
import billingRoutes from "./routes/onboarding/billingRoutes.js";
import socialAuthRoutes from "./routes/onboarding/socialAuthRoutes.js";
import setPasswordRoutes from "./routes/onboarding/setPasswordRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import { stripeWebhook } from "./controllers/subscriptionController.js";

const app = express();
connectDB();

app.set("trust proxy", 1);

// Allowed origins
const allowedOrigins = [
  'https://growdex.ai',
  'https://growdex.netlify.app',
  "http://localhost:5173",
  "http://localhost:5174"
];



// Stripe webhook MUST be before express.json()
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 200 }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api', joinWaitlistRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-dashboard", adminBlogRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", user);

// Onboarding step routes
app.use("/api/company-setup", companyRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/social-auth", socialAuthRoutes);
app.use("/api/onboarding", setPasswordRoutes);
// Stripe / Subscription routes
app.use("/api/stripe", stripeRoutes);

// Test route
app.get('/', (req, res) => res.send('Growdex API is running'));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
