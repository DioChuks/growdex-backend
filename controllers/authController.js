// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import { signAccessToken, signRefreshToken, sendRefreshCookie } from '../utils/token.js';
// import { requireAuth } from '../middleware/authMiddleware.js';


// export async function signup(req, res) {
//   const { email, password, name } = req.body || {};
//   if (!email || !password) return res.status(400).json({ error: 'email & password required' });
//   const existing = await User.findOne({ email: email.toLowerCase() });
//   if (existing) return res.status(409).json({ error: 'Email already in use' });
//   const passwordHash = await bcrypt.hash(password, 12);
//   const user = await User.create({ email: email.toLowerCase(), passwordHash, name });
//   const access = signAccessToken(user);
//   const refresh = signRefreshToken(user);
//   sendRefreshCookie(res, refresh);
//   res.json({ accessToken: access, user: { id: user._id, email: user.email, name: user.name } });
// }

// export async function login(req, res) {
//   const { email, password } = req.body || {};
//   const user = await User.findOne({ email: email?.toLowerCase() });
//   if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
//   const ok = await bcrypt.compare(password, user.passwordHash);
//   if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
//   const access = signAccessToken(user);
//   const refresh = signRefreshToken(user);
//   sendRefreshCookie(res, refresh);
//   res.json({ accessToken: access, user: { id: user._id, email: user.email, name: user.name } });
// }

// export async function logout(req, res) {
//   const token = req.cookies[process.env.COOKIE_NAME || 'rt'];
//   if (token) {
//     try {
//       const { sub } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//       await User.findByIdAndUpdate(sub, { $inc: { tokenVersion: 1 } });
//     } catch {}
//   }
//   res.clearCookie(process.env.COOKIE_NAME || 'rt', { path: '/auth/refresh' });
//   res.json({ ok: true });
// }

// export async function refreshToken(req, res) {
//   const token = req.cookies[process.env.COOKIE_NAME || 'rt'];
//   if (!token) return res.status(401).json({ error: 'No refresh token' });
//   try {
//     const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//     const user = await User.findById(payload.sub);
//     if (!user) return res.status(401).json({ error: 'User not found' });
//     if ((user.tokenVersion || 0) !== (payload.tv || 0)) return res.status(401).json({ error: 'Token revoked' });
//     const access = signAccessToken(user);
//     const newRefresh = signRefreshToken(user);
//     sendRefreshCookie(res, newRefresh);
//     res.json({ accessToken: access, user: { id: user._id, email: user.email, name: user.name } });
//   } catch {
//     return res.status(401).json({ error: 'Invalid refresh token' });
//   }
// }

// export async function getMe(req, res) {
//   const user = await User.findById(req.user.sub).lean();
//   res.json({ user: user ? { id: user._id, email: user.email, name: user.name } : null });
// }

// // Social handler
// export function socialHandler(req, res) {
//   const user = req.user;
//   const refresh = signRefreshToken(user);
//   sendRefreshCookie(res, refresh);
//   res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
// }

// export { requireAuth };
