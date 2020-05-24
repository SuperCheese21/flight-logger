import passport from 'passport';

import facebookStrategy from './facebook';
import googleStrategy from './google';
import jwtStrategy from './jwt';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(facebookStrategy);
passport.use(googleStrategy);
passport.use(jwtStrategy);

export default passport;
