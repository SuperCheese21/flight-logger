import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { profileHandler } from './util';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../config.json';

export default new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  },
  profileHandler,
);
