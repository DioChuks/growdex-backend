import { appConfig } from "../config.js";

/**
 * Middleware to check for API key in request headers
 * Expects the API key to be passed in the 'x-api-key' header
 */
export const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required'
        });
    }

    if (apiKey !== appConfig.waitlistApiKey) {
        return res.status(403).json({
            success: false,
            message: 'Invalid API key'
        });
    }

    next();
};
