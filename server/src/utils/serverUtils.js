import geoTz from 'geo-tz';
import moment from 'moment-timezone';
import paginate from 'express-paginate';
import * as Promise from 'bluebird';

export const generateRandomId = length => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const getTimeZoneName = location => {
  const { lat, lon } = location;
  return geoTz(lat, lon)[0];
};

export const getLocalTime = (location, utcTime) => {
  const timeZoneName = getTimeZoneName(location);
  return moment(utcTime)
    .tz(timeZoneName)
    .format();
};

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

export const singleResult = model => async (req, res, next) => {
  const _id = req.params.id;
  const query = model.findOne({ _id });
  try {
    const result = await query.exec();
    if (result) {
      res.json(result);
    } else {
      next();
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

export const paginatedSearchResults = (model, searchFields, sort) => async (
  req,
  res,
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
    res.sendStatus(500);
  }
};
