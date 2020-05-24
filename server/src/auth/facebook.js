import { Strategy as FacebookStrategy } from 'passport-facebook';

import { profileHandler } from './util';

import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from '../../config.json';

export default new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails'],
  },
  profileHandler,
);
