import express from 'express';

import { generateToken } from '../../auth/jwt';
import passport from '../../auth/passport';

const router = express.Router();

router.use(passport.initialize());

router.get('/google', passport.authenticate('google', { scope: ['email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  generateToken,
);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  generateToken,
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
