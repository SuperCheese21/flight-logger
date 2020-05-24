import jwt from 'jsonwebtoken';

import User from '../models/user';

import { JWT_SECRET } from '../../config.json';

export const generateToken = (req, res) => {
  const {
    user: { _id: id, admin },
  } = req;
  const token = jwt.sign({ id, admin }, JWT_SECRET, {
    expiresIn: '24h',
  });
  res.json({ token });
};

export const profileHandler = (
  accessToken,
  refreshToken,
  profile,
  callback,
) => {
  const email = profile.emails[0].value;
  User.findOrCreate({ email }, { _id: email, email }, callback);
};
