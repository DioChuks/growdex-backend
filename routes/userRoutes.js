// import express from "express";
// import {
//   login,
//   logout,
//   signup,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   checkAuth,
// } from "../controllers/userController.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// router.get("/check-auth", verifyToken, checkAuth);

// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/logout", logout);

// router.post("/verify-email", verifyEmail);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// export default router;


import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  loginWithGoogle,  // <-- import new controller
  resendVerificationEmail,
  verifyPasswordOtp
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { loginLimiter, passwordResetLimiter, resendOTPLimiter, signupLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signupLimiter, signup);
router.post("/login", loginLimiter, login);
router.post("/google-login", loginWithGoogle); // <-- new route
router.get("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendOTPLimiter, resendVerificationEmail);
// Send OTP to email
router.post("/forgot-password", passwordResetLimiter, forgotPassword);

// Verify OTP
router.post("/verify-password-otp", verifyPasswordOtp);

// Reset password with OTP
router.post("/reset-password", resetPassword);


export default router;
