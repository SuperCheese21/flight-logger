import 'regenerator-runtime/runtime';

import express from 'express';
import paginate from 'express-paginate';
import swaggerUi from 'swagger-ui-express';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';
import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';

import apiSpec from '../../openapi.json';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
});

router.use(paginate.middleware(10, 50));

router.get('/aircraft', async (req, res, next) => {
  const {
    query: { limit, page },
    skip,
  } = req;
  const getPages = paginate.getArrayPages(req);

  const filter = {};
  const resultsQuery = Aircraft.find(filter)
    .limit(limit)
    .skip(skip)
    .select({ _id: 0, __v: 0 })
    .lean();
  const countQuery = Aircraft.countDocuments(filter);

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
    res.json({ metadata, results });
  } catch (err) {
    next(err);
  }
});

router.get('/airlines', async (req, res) => {
  const { q } = req.query;
  if (q) {
    const query = Airline.find({});
    const airlines = await query.exec();
    res.json(airlines);
  } else {
    res.sendStatus(400);
  }
});

router.get('/airports/:id', async (req, res) => {
  const { id } = req.params;
  const query = Airport.findOne({ _id: id });
  const airport = await query.exec();
  if (airport) {
    res.json(airport);
  } else {
    res.sendStatus(404);
  }
});

router.get('/countries', async (req, res) => {
  const query = Country.find({});
  const countries = await query.exec();
  res.json(countries);
});

router.get('/countries/:id', async (req, res) => {
  const { id } = req.params;
  const query = Country.findOne({ _id: id });
  const country = await query.exec();
  if (country) {
    res.json(country);
  } else {
    res.sendStatus(404);
  }
});

router.get('/regions', async (req, res) => {
  const query = Region.find({});
  const regions = await query.exec();
  res.json(regions);
});

router.get('/regions/:id', async (req, res) => {
  const { id } = req.params;
  const query = Region.findOne({ _id: id });
  const region = await query.exec();
  if (region) {
    res.json(region);
  } else {
    res.sendStatus(404);
  }
});

export default router;
