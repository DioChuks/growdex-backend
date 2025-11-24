// // middlewares/requireAuth.js
// import jwt from 'jsonwebtoken';

// export function requireAuth(req, res, next) {
//   const auth = req.headers.authorization;

//   if (!auth?.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const token = auth.split(' ')[1];

//   try {
//     req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     next();
//   } catch {
//     return res.status(401).json({ error: 'Invalid or expired token' });
//   }
// }
