import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from '../models/user';
import { google } from '../../config.json';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = google;

export default new GoogleStrategy(
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
