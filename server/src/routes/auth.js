import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import passport from 'passport';

import googleStrategy from '../auth/google';
import jwtStrategy from '../auth/jwt';
import { jwt } from '../../config.json';

const { JWT_SECRET } = jwt;

// TODO: Move passport initialization code to separate file

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(googleStrategy);
passport.use(jwtStrategy);

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
    const {
      user: { _id: id },
    } = req;
    const token = jsonwebtoken.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  },
);

export default router;
