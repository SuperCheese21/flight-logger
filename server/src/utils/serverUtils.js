import Promise from 'bluebird';
import paginate from 'express-paginate';
import moment from 'moment-timezone';

export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

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
  } catch ({ message }) {
    res.status(500).json({ message });
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
  } catch ({ message }) {
    res.status(500).json({ message });
  }
};
