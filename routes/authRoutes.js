// import { Router } from 'express';
// import passport from '../config/passport.js';
// import {
//   signup,
//   login,
//   logout,
//   refreshToken,
//   getMe,
//   socialHandler
// } from '../controllers/authController.js';

// const router = Router();

// // Email/password
// router.post('/signup', signup);
// router.post('/login', login);
// router.post('/logout', logout);
// router.get('/refresh', refreshToken);
// router.get('/me', getMe);

// // Social login routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', passport.authenticate('google', { session: false }), socialHandler);

// router.get('/linkedin', passport.authenticate('linkedin'));
// router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false }), socialHandler);

// router.get('/twitter', passport.authenticate('twitter'));
// router.get('/twitter/callback', passport.authenticate('twitter', { session: false }), socialHandler);

// router.get('/instagram', passport.authenticate('instagram'));
// router.get('/instagram/callback', passport.authenticate('instagram', { session: false }), socialHandler);

// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), socialHandler);

// export default router;
