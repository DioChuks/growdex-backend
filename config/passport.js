// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
// import { Strategy as InstagramStrategy } from 'passport-instagram';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// import User from '../models/User.js';

// async function upsertOAuthUser({ provider, profile }) {
//   const providerId = profile.id;
//   const email = profile.emails?.[0]?.value?.toLowerCase();
//   const name = profile.displayName || profile.username;
//   const avatar = profile.photos?.[0]?.value;

//   let user = await User.findOne({
//     $or: [
//       { 'providers.name': provider, 'providers.providerId': providerId },
//       ...(email ? [{ email }] : []),
//     ],
//   });

//   if (!user) {
//     user = await User.create({
//       email,
//       name,
//       avatar,
//       providers: [{ name: provider, providerId }],
//     });
//   } else {
//     const exists = user.providers.some(p => p.name === provider && p.providerId === providerId);
//     if (!exists) user.providers.push({ name: provider, providerId });
//     if (!user.avatar && avatar) user.avatar = avatar;
//     if (!user.name && name) user.name = name;
//     if (!user.email && email) user.email = email;
//     await user.save();
//   }
//   return user;
// }

// // Google
// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: process.env.GOOGLE_CALLBACK
// }, async (_, __, profile, done) => {
//   try { done(null, await upsertOAuthUser({ provider: 'google', profile })); }
//   catch (e) { done(e); }
// }));

// // LinkedIn
// passport.use(new LinkedInStrategy({
//   clientID: process.env.LINKEDIN_CLIENT_ID,
//   clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//   callbackURL: process.env.LINKEDIN_CALLBACK,
//   scope: ['r_emailaddress', 'r_liteprofile']
// }, async (_, __, profile, done) => {
//   try { done(null, await upsertOAuthUser({ provider: 'linkedin', profile })); }
//   catch (e) { done(e); }
// }));

// // Twitter (X)
// passport.use(new TwitterStrategy({
//   consumerKey: process.env.TWITTER_CONSUMER_KEY,
//   consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//   callbackURL: process.env.TWITTER_CALLBACK,
//   includeEmail: true
// }, async (_, __, profile, done) => {
//   try { done(null, await upsertOAuthUser({ provider: 'twitter', profile })); }
//   catch (e) { done(e); }
// }));

// // Instagram (Basic Display - profile only, no email)
// passport.use(new InstagramStrategy({
//   clientID: process.env.INSTAGRAM_CLIENT_ID,
//   clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
//   callbackURL: process.env.INSTAGRAM_CALLBACK
// }, async (_, __, profile, done) => {
//   try { done(null, await upsertOAuthUser({ provider: 'instagram', profile })); }
//   catch (e) { done(e); }
// }));

// // Facebook
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: process.env.FACEBOOK_CALLBACK,
//   profileFields: ['id', 'displayName', 'photos', 'email']
// }, async (_, __, profile, done) => {
//   try { done(null, await upsertOAuthUser({ provider: 'facebook', profile })); }
//   catch (e) { done(e); }
// }));

// export default passport;
