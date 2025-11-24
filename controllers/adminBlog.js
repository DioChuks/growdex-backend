// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { signAccess, signRefresh } from "../utils/jwt.js";

// const {
//   JWT_REFRESH_SECRET = "dev_refresh_secret_change_me",
//   COOKIE_SECURE = "false",
// } = process.env;

// // ====== CONTROLLERS ======

// // 🔑 Login (Admin only)
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find admin by email
//     const user = await User.findOne({ email, role: "admin" });
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     // Compare password
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     // Generate tokens
//     const payload = { sub: user._id, email: user.email, role: user.role };
//     const accessToken = signAccess(payload);
//     const refreshToken = signRefresh({ sub: user._id });

//     // Send tokens
//     res
//       .cookie("gid", refreshToken, {
//         httpOnly: true,
//         sameSite: "lax",
//         secure: COOKIE_SECURE === "true",
//         path: "/api/auth/refresh",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .json({ 
//         accessToken, 
//         user: { id: user._id, email: user.email, name: user.name } 
//       });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // 🔄 Refresh access token
// export const refresh = async (req, res) => {
//   const token = req.cookies.gid;
//   if (!token) return res.status(401).json({ message: "No refresh cookie" });

//   try {
//     const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

//     const user = await User.findById(decoded.sub);
//     if (!user) return res.status(401).json({ message: "User not found" });

//     const accessToken = signAccess({ sub: user._id, email: user.email, role: user.role });
//     res.json({ accessToken });
//   } catch {
//     return res.status(401).json({ message: "Invalid refresh token" });
//   }
// };

// // 🚪 Logout
// export const logout = (req, res) => {
//   res.clearCookie("gid", { path: "/api/auth/refresh" }).json({ ok: true });
// };

// // 👤 Get logged-in admin info
// export const getMe = async (req, res) => {
//   try {
//     const me = await User.findById(req.user.sub).select("-password");
//     if (!me) return res.status(404).json({ message: "Admin not found" });

//     res.json({ id: me._id, email: me.email, name: me.name });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { signAccess, signRefresh } from "../utils/jwt.js";
import { COOKIE_SECURE, JWT_REFRESH_SECRET } from "../config.js";
import cloudinary from "../config/cloudinary.js";



// 🔑 Admin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Ensure it's an admin
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    // Create tokens
// Create tokens
const payload = { 
  sub: admin._id, 
  email: admin.email, 
  role: admin.role, 
  name: admin.name ,
  avatar: admin.avatar || null 
};

const accessToken = signAccess(payload);
    const refreshToken = signRefresh({ sub: admin._id.toString(), role: admin.role }); 

    // const accessToken = signAccess(payload);
    // const refreshToken = signRefresh({ sub: admin._id, name: admin.name });

    // Send refresh token as httpOnly cookie + access token in JSON
    res.cookie("gid", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: COOKIE_SECURE,    // <-- FIXED
      path: "/",       // <-- FIXED
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({
      accessToken,
      admin: payload,
    });
    
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Refresh Admin Access Token

export const refresh = async (req, res) => {
  const token = req.cookies.gid;
  if (!token) return res.status(401).json({ message: "No refresh cookie" });

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    const admin = await User.findOne({ _id: decoded.sub, role: "admin" });
    if (!admin) return res.status(401).json({ message: "Admin not found" });

const payload = { 
      sub: admin._id.toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
      avatar: admin.avatar || null 
    };

    const accessToken = signAccess(payload);


      res.json({ accessToken, admin: payload });
  } catch (err) {
    console.error("Admin refresh error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};


// 🚪 Admin Logout
export const logout = (req, res) => {
  res.clearCookie("gid", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return res.json({ ok: true });
  
};

// 👤 Get Current Admin Info
export const getMe = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.user.sub, role: "admin" }).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ id: admin._id, email: admin.email, name: admin.name, avatar: admin.avatar || null });
  } catch (err) {
    console.error("Admin getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updateProfileImage = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No image uploaded" });

//     const upload = await cloudinary.uploader.upload(req.file.path, {
//       folder: "admin-profiles",
//     });

//     const user = await User.findByIdAndUpdate(
//       req.user.sub, 
//       { avatar: upload.secure_url },   // fix here
//       { new: true }
//     );

//     res.json({ message: "Profile image updated", avatar: user.avatar });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ message: "Error uploading profile image" });
//   }
// };

export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // upload to cloudinary
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "admin-profiles",
    });

    // update user in DB
    const admin = await User.findByIdAndUpdate(
      req.user.sub,
      { avatar: upload.secure_url },
      { new: true }
    ).select("-password"); // remove password from returned object

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // send back full updated admin info
    res.json({
      message: "Profile image updated",
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        avatar: admin.avatar || null,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Error uploading profile image" });
  }
};
