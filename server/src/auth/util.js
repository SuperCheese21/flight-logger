import User from '../models/user';

// eslint-disable-next-line import/prefer-default-export
export const profileHandler = (
  accessToken,
  refreshToken,
  profile,
  callback,
) => {
  const email = profile.emails[0].value;
  User.findOrCreate(
    { email },
    { username: email, admin: false, privacy: 'public' },
    callback,
  );
};
