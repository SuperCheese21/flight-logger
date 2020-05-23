import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import User from '../models/user';
import { jwt } from '../../config.json';

const { JWT_SECRET } = jwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export default new JwtStrategy(opts, ({ id }, done) => {
  User.findOne({ id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});
