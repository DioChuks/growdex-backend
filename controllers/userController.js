import bcryptjs from "bcryptjs";
import crypto from "crypto";
import PendingUser from "../models/PendingUser.js";
import User  from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../nodeMailer/email.js";
import { OAuth2Client } from "google-auth-library";




// export const signup = async (req, res) => {
//   const { email} = req.body;
//   const lowerCaseEmail = email.toLowerCase();
 

// // Remove expired pending users for this email
// await PendingUser.deleteMany({ 
//   email: lowerCaseEmail, 
//   verificationTokenExpiresAt: { $lt: Date.now() } 
// });

// // Now check if a pending user exists
// let pending = await PendingUser.findOne({ email: lowerCaseEmail });
// if (pending) {
//   return res.status(400).json({ 
//     success: false, 
//     message: "Please verify your email. A code has already been sent." 
//   });
// }


//   try {
//     if (!email ) {
//       return res.status(400).json({ success: false, message: "Email is required" });
//     }

//     // Check if already verified user exists
//     const existingUser = await User.findOne({ email: lowerCaseEmail });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "User already exists" });
//     }

//     // Check if already pending
//     let pending = await PendingUser.findOne({ email: lowerCaseEmail });
//     if (pending) {
//       return res.status(400).json({ success: false, message: "Please verify your email. A code has already been sent." });
//     }

//     // const hashedPassword = await bcryptjs.hash(password, 10);
//     const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

//     pending = new PendingUser({
//       email: lowerCaseEmail,
//       password: null,
//       verificationToken,
//       verificationTokenExpiresAt: Date.now() + 20 * 60 * 1000, // 20 min
//     });

//     await pending.save();

//     await sendVerificationEmail(pending.email, verificationToken);

//     res.status(201).json({
//       success: true,
//       message: "Signup successful. Please verify your email.",
//     });
//   } catch (error) {
//     console.error("Error in signup:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

export const signup = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const lowerCaseEmail = email.toLowerCase();

    // Remove expired pending users
    await PendingUser.deleteMany({ 
      email: lowerCaseEmail, 
      verificationTokenExpiresAt: { $lt: new Date() } 
    });

    // Check if a pending user already exists
    let pending = await PendingUser.findOne({ email: lowerCaseEmail });
    if (pending) {
      return res.status(400).json({ 
        success: false, 
        message: "Please verify your email. A code has already been sent." 
      });
    }

    // Check if a verified user already exists
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new pending user
    pending = new PendingUser({
      email: lowerCaseEmail,
      password: null,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 min
      resendCount: 0,
      lastResendAt: new Date(),
    });

    await pending.save();

    // Send verification email
    await sendVerificationEmail(pending.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const lowerEmail = email.toLowerCase();

    const pendingUser = await PendingUser.findOne({ email: lowerEmail });
    if (!pendingUser) {
      return res.status(400).json({
        success: false,
        message: "No pending account found for this email. Please sign up again.",
      });
    }

    const now = Date.now();

    // Reset resend count if last resend was more than 1 hour ago
    if (pendingUser.lastResendAt && now - pendingUser.lastResendAt.getTime() > 60 * 60 * 1000) {
      pendingUser.resendCount = 0;
    }

    // Block if over 3 attempts in last hour
    if (pendingUser.resendCount >= 3) {
      return res.status(429).json({
        success: false,
        message: "Too many resend attempts. Please try again later.",
      });
    }

    // Generate new verification code + expiry
    pendingUser.verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    pendingUser.verificationTokenExpiresAt = new Date(now + 20 * 60 * 1000);
    pendingUser.resendCount += 1;
    pendingUser.lastResendAt = new Date();

    await pendingUser.save();
    await sendVerificationEmail(pendingUser.email, pendingUser.verificationToken);

    res.status(200).json({
      success: true,
      message: "New verification code sent to your email.",
    });
  } catch (err) {
    console.error("Error resending verification email:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const verifyEmail = async (req, res) => {
  const { code, email } = req.body;
  try {
    const pending = await PendingUser.findOne({
      email: email.toLowerCase(),
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!pending) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    // Create user with no password (they can set it later)
    const user = await User.create({
      email: pending.email.toLowerCase(),
      password: null,
      isVerified: true,
        onboardingCompleted: false,
  currentStep: 1,
    });

    await pending.deleteOne();

    await sendWelcomeEmail(user.email);
    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
  success: true,
  message: "Email verified successfully",
  user: {
    _id: user._id,
    email: user.email,
    isVerified: user.isVerified,
    onboardingCompleted: user.onboardingCompleted,
    currentStep: user.currentStep,
  },
});

  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  const lowerCaseEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
  return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
}

  //  Don’t allow login if onboarding not finished
    if (!user.onboardingCompleted || !user.password) {
      return res.status(400).json({
        message: "You must complete onboarding before logging in",
      });
    }


    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

  
    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const lowerCaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerCaseEmail });

    if (!user) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry in user document
    user.resetPasswordToken = otp;
   user.resetPasswordExpiresAt = new Date(Date.now() + 20 * 60 * 1000);
 // 20 min expiry
    await user.save();

    // Send OTP email (reuse your sendVerificationEmail function or make a sendPasswordOtpEmail)
    await sendVerificationEmail(user.email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email for password reset",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        password: hashed,
        onboardingCompleted: true,
        currentStep: 5,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Password set successfully, onboarding complete",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const verifyPasswordOtp = async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: code,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: code,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    sendResetSuccessEmail(user.email, user.name);

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
       requiresOnboarding: !user.onboardingCompleted,
    });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// export const loginWithGoogle = async (req, res) => {
//   try {
//     const { credential } = req.body;
//     const ticket = await client.verifyIdToken({
//       idToken: credential,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     const { email, name, picture, sub } = payload;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         email,
//         name,
//         password: null,
//         isVerified: true,
//         googleId: sub,
//         avatar: picture,
//       });
//     }

//     // Set cookie
//     generateTokenAndSetCookie(res, user._id);

//     res.status(200).json({
//       success: true,
//       user: {
//         id: user._id,
//         email: user.email,
//         name: user.name,
//         avatar: user.avatar,
//       },
//     });
//   } catch (error) {
//     console.error("Google Auth Error:", error);
//     res.status(500).json({ success: false, message: "Google authentication failed" });
//   }
// };

export const loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        email,
        name,
        password: null,
        isVerified: true,
        providers: [{ name: "google", providerId: sub }],
        avatar: picture,
        onboardingCompleted: false,
        currentStep: 1,
      });
      isNewUser = true;
    } else {
      // Link Google if not already
      const hasGoogle = user.providers.some((p) => p.name === "google");
      if (!hasGoogle) {
        user.providers.push({ name: "google", providerId: sub });
        user.avatar = picture;
        await user.save();
      }
    }

    // 🚨 Key part: If onboarding not finished, don’t set cookie yet
    if (!user.onboardingCompleted) {
      return res.status(200).json({
        success: true,
        requiresOnboarding: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
        isNewUser,
      });
    }

    // Otherwise, treat as logged in
    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      isNewUser,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, message: "Google authentication failed" });
  }
};
