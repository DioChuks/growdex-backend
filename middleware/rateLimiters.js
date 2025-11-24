// import rateLimit from "express-rate-limit";

// // Helper to extract email from request body (fallback to IP if not provided)
// const keyByEmail = (req) => {
//   return req.body?.email || req.ip;
// };

// // Signup attempts — 5 per hour per user
// export const signupLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//     max: 5,
//     keyGenerator: keyByEmail,
//     message: {
//         success: false,
//         message: "Too many signup attempts for this account. Try again in 1 hour.",
//         },
// });

// // Resend OTP — 3 per hour per user
// export const resendOTPLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3,
//   keyGenerator: keyByEmail,
//   message: {
//     success: false,
//     message: "Too many OTP resend attempts for this account. Try again in 1 hour.",
//   },
// });

// //  Login attempts — 5 per 15 min per user
// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5,
//   keyGenerator: keyByEmail,
//   message: {
//     success: false,
//     message: "Too many login attempts for this account. Try again in 15 minutes.",
//   },
// });
// //  Password reset requests — 3 per hour per user
// export const passwordResetLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 3,
//   keyGenerator: keyByEmail,
//   message: {
//     success: false,
//     message:
//       "Too many password reset requests for this account. Try again in 1 hour.",
//   },
// });

import rateLimit from "express-rate-limit";

// Helper to extract email from request body (fallback to IPv4/IPv6-safe IP)
const keyByEmail = (req, res) => {
  if (req.body?.email) return req.body.email;
  return rateLimit.keyGeneratorIpFallback(req, res); // safe fallback for IPv6
};

// Signup attempts — 5 per hour per user
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: keyByEmail,
  message: {
    success: false,
    message: "Too many signup attempts for this account. Try again in 1 hour.",
  },
});

// Resend OTP — 3 per hour per user
export const resendOTPLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: keyByEmail,
  message: {
    success: false,
    message: "Too many OTP resend attempts for this account. Try again in 1 hour.",
  },
});

// Login attempts — 5 per 15 min per user
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: keyByEmail,
  message: {
    success: false,
    message: "Too many login attempts for this account. Try again in 15 minutes.",
  },
});

// Password reset requests — 3 per hour per user
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: keyByEmail,
  message: {
    success: false,
    message:
      "Too many password reset requests for this account. Try again in 1 hour.",
  },
});
