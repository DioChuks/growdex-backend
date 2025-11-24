// config.js
import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    clientUrl: process.env.CLIENT_URL,
    mongoUri: process.env.MONGO_URI,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    brevoApiKey: process.env.BREVO_API_KEY,
    brevoListId: process.env.BREVO_LIST_ID,
};

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";
