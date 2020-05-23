import express from 'express';
import passport from 'passport';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { google } from '../../config.json';
import User from '../models/user';

// TODO: Move passport initialization code to separate file

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = google;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  },
  (accessToken, refreshToken, profile, callback) => {
    const email = profile.emails[0].value;
    User.findOrCreate({ email }, { _id: profile.id, email }, callback);
  },
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(googleStrategy);

const router = express.Router();

router.use(passport.initialize());

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile');
  },
);

export default router;
