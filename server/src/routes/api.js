import 'regenerator-runtime/runtime';

import express from 'express';
import paginate from 'express-paginate';
import swaggerUi from 'swagger-ui-express';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';
import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';
import { paginatedResults } from '../utils/serverUtils';

import apiSpec from '../../openapi.json';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
});

router.use(paginate.middleware(10, 50));

router.get('/aircraft', paginatedResults(Aircraft), (req, res) => {
  res.json(res.paginatedResults);
});

router.get('/airlines', paginatedResults(Airline), (req, res) => {
  res.json(res.paginatedResults);
});

router.get('/airports', paginatedResults(Airport), (req, res) => {
  res.json(res.paginatedResults);
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
