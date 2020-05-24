import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import User from '../models/user';
import { JWT_SECRET } from '../../config.json';

export const generateToken = (req, res) => {
  const {
    user: { _id: id },
  } = req;
  console.log({ id });
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export default new JwtStrategy(opts, ({ id }, done) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
});
