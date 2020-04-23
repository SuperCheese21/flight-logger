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

export const paginatedSearchResults = (model, searchFields) => async (
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
    .select({ __v: 0 })
    .limit(limit)
    .skip(skip)
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
      limit,
      pageCount,
      itemCount,
      pages: getPages(3, pageCount, page),
    };
    res.json({ metadata, results });
  } catch (err) {
    console.error(err);
  }
};
