// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token)
//     return res
//       .status(401)
//       .json({ success: false, message: "Please login to continue" });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (!decoded)
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized - invalid token" });
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Please login to continue" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized: user not found" });

    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
