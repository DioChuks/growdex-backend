// import jwt from 'jsonwebtoken';

// export function signAccessToken(user) {
//   return jwt.sign(
//     { sub: user._id.toString(), email: user.email, name: user.name },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m' }
//   );
// }

// export function signRefreshToken(user) {
//   return jwt.sign(
//     { sub: user._id.toString(), tv: user.tokenVersion || 0 },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: process.env.REFRESH_TOKEN_TTL || '7d' }
//   );
// }

// export function sendRefreshCookie(res, token) {
//   res.cookie(process.env.COOKIE_NAME || 'rt', token, {
//     httpOnly: true,
//     secure: false, // set true in production with HTTPS
//     sameSite: 'lax',
//     path: '/auth/refresh',
//     maxAge: 7*24*60*60*1000
//   });
// }
