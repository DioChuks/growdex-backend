export const appConfig = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    clientUrl: process.env.CLIENT_URL,
    mongoUri: process.env.MONGO_URI,
    mailerLiteApiKey: process.env.MAILERLITE_API_KEY,
    mailerLiteGroupId: process.env.MAILERLITE_GROUP_ID,
    waitlistApiKey: process.env.WAITLIST_API_KEY,
};
