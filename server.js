// CRITICAL: Import env.js FIRST to load environment variables
import './env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { generalLimiter } from './middleware/rateLimiters.js';

// Routes
import postRoutes from './routes/postRoutes.js';
import joinWaitlistRoute from './routes/joinWaitlist.js';

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
app.use(generalLimiter);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api', joinWaitlistRoute);

// Test route
app.get('/', (req, res) => res.send('Growdex API v1.0.0 is running'));

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
