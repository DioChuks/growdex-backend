// import jwt from "jsonwebtoken";

// const { JWT_ACCESS_SECRET = "dev_access_secret_change_me" } = process.env;

// export const authGuard = (req, res, next) => {
//   const auth = req.headers.authorization; // "Bearer <token>"
//   if (!auth) return res.status(401).json({ message: "No authorization header" });

//   const token = auth.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid/expired token" });
//   }
// };


// middlewares/auth.js
import { verifyAccess } from "../utils/jwt.js";

export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccess(token);

    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin only" });
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
