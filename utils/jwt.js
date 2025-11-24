import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../config.js";

export const signAccess = (payload) =>
  jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15m" });

export const signRefresh = (payload) =>
  jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyAccess = (token) =>
  jwt.verify(token, JWT_ACCESS_SECRET);

export const verifyRefresh = (token) =>
  jwt.verify(token, JWT_REFRESH_SECRET);
