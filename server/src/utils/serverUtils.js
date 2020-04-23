import paginate from 'express-paginate';

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

export const paginatedResults = model => async (req, res, next) => {
  const {
    query: { limit, page },
    skip,
  } = req;
  const getPages = paginate.getArrayPages(req);

  const filter = {};
  const resultsQuery = model
    .find(filter)
    .limit(limit)
    .skip(skip)
    .select({ _id: 0, __v: 0 })
    .lean();
  const countQuery = model.countDocuments(filter);

  try {
    const [results, itemCount] = await Promise.all([
      resultsQuery.exec(),
      countQuery.exec(),
    ]);
    const pageCount = Math.ceil(itemCount / limit);
    const metadata = {
      page,
      limit,
      pageCount,
      itemCount,
      pages: getPages(3, pageCount, page),
    };
    res.paginatedResults = { metadata, results };
    next();
  } catch (err) {
    console.error(err);
  }
};
