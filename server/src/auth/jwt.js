import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import User from '../models/user';
import { JWT_SECRET } from '../../config.json';

export const generateToken = (req, res) => {
  const {
    user: { _id: id, admin },
  } = req;
  const token = jwt.sign({ id, admin }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
};

const verifyToken = ({ id, admin }, done) => {
  console.log({ admin });
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export default new JwtStrategy(opts, verifyToken);
