import 'regenerator-runtime/runtime';

import express from 'express';
import paginate from 'express-paginate';
import swaggerUi from 'swagger-ui-express';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';
import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';
import { paginatedSearchResults } from '../utils/serverUtils';

import apiSpec from '../../openapi.json';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
});

router.use(paginate.middleware(10, 50));

router.get(
  '/aircraft',
  paginatedSearchResults(Aircraft, ['icao', 'iata', 'names']),
);

router.get(
  '/airlines',
  paginatedSearchResults(Airline, ['icao', 'iata', 'name', 'callsign']),
);

router.get(
  '/airports',
  paginatedSearchResults(Airport, [
    '_id',
    'codes.gps',
    'codes.iata',
    'codes.local',
    'municipality',
    'name',
  ]),
);

router.get('/countries', paginatedSearchResults(Country, ['_id', 'name']));

router.get(
  '/regions',
  paginatedSearchResults(Region, ['_id', 'localCode', 'name']),
);

export default router;
