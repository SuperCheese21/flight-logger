import 'regenerator-runtime/runtime';

import jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import User from '../models/user';
import { JWT_SECRET } from '../../config.json';

export const generateToken = (req, res) => {
  const {
    user: { _id: sub, privacy },
  } = req;
  const token = jwt.sign({ sub, privacy }, JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({ token });
};

const verifyToken = async ({ sub }, done) => {
  const query = User.findOne({ _id: sub });
  try {
    const user = await query.exec();
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

export default new JwtStrategy(opts, verifyToken);
