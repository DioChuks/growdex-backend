import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // true in prod, false in dev
    sameSite: isProd ? "none" : "lax", // none for prod cross-site, lax for localhost
    domain: isProd ? ".growdex.ai" : undefined, // only set domain in prod
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });

  return token;
};

