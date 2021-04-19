import Promise from 'bluebird';
import paginate from 'express-paginate';
import moment from 'moment-timezone';
import passport from 'passport';

import AppError from './error';

import Friends from '../models/friends';

export const generateRandomId = length => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getUTCTime = (date, time, timeZoneName) =>
  moment
    .tz(`${date}T${time}`, timeZoneName)
    .utc()
    .format();

export const normalizePort = val => {
  const newPort = parseInt(val, 10);

  if (Number.isNaN(newPort)) {
    return val;
  }

  if (newPort >= 0) {
    return newPort;
  }

  return false;
};

export const authorize = async (user, owner) => {
  if (!user || !owner) {
    return false;
  }
  const { _id: ownerId, privacy } = owner;
  const { _id: userId } = user;
  const isFriends = Friends.findFriends(ownerId, userId, 'accepted');
  if (
    privacy === 'public' ||
    (privacy === 'private' && userId.equals(ownerId)) ||
    (privacy === 'friends' && (await isFriends))
  ) {
    return true;
  }
  return false;
};

export const authenticateEntity = async (req, res, next) => {
  const { query } = req;
  try {
    const entity = await query.populate('user').exec();
    if (!entity) {
      throw new AppError(404, `Entity Not Found`);
    }
    const owner = entity.user;
    passport.authenticate('jwt', async (err, user) => {
      try {
        if (err) {
          throw new AppError(500, err.message);
        }
        const isAuthorized = await authorize(user, owner);
        if (isAuthorized) {
          res.json(entity);
        } else {
          throw new AppError(401, 'Unauthorized to access entity');
        }
      } catch (e) {
        next(e);
      }
    })(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const authenticateOptional = async (req, res, next) => {
  passport.authenticate('jwt', async (err, user) => {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export const singleResult = model => async (req, res, next) => {
  const _id = req.params.id;
  const query = model.findOne({ _id });
  try {
    const result = await query.exec();
    if (result) {
      res.json(result);
    } else {
      throw new AppError(404, `${model.modelName} not found`);
    }
  } catch (err) {
    next(err);
  }
};

export const paginatedSearchResults = (model, searchFields, sort) => async (
  req,
  res,
  next,
) => {
  const {
    query: { limit, page, q },
    skip,
  } = req;
  const getPages = paginate.getArrayPages(req);

  const regex = new RegExp(q, 'gi');
  const filter = {
    ...(searchFields && {
      $or: searchFields.map(field => ({
        [field]: regex,
      })),
    }),
  };

  const paginatedQuery = model
    .find(filter)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select({ __v: 0 })
    .lean();
  const countQuery = model.countDocuments(filter);

  try {
    const [results, itemCount] = await Promise.all([
      paginatedQuery.exec(),
      countQuery.exec(),
    ]);
    const pageCount = Math.ceil(itemCount / limit);
    const metadata = {
      page,
      pageCount,
      limit,
      itemCount,
      pages: getPages(3, pageCount, page),
    };
    res.json({ metadata, results });
  } catch (err) {
    next(err);
  }
};
