import 'regenerator-runtime/runtime';

import express from 'express';
import paginate from 'express-paginate';
import swaggerUi from 'swagger-ui-express';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';
import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';
import { paginatedResults, searchFilter } from '../utils/serverUtils';

import apiSpec from '../../openapi.json';

const router = express.Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
});

router.use(paginate.middleware(10, 50));

router.get(
  '/aircraft',
  searchFilter(['icao', 'iata', 'names']),
  paginatedResults(Aircraft),
);

router.get(
  '/airlines',
  searchFilter(['icao', 'iata', 'name', 'callsign']),
  paginatedResults(Airline),
);

router.get(
  '/airports',
  searchFilter([
    '_id',
    'codes.gps',
    'codes.iata',
    'codes.local',
    'municipality',
    'name',
  ]),
  paginatedResults(Airport),
);

router.get(
  '/countries',
  searchFilter(['_id', 'name']),
  paginatedResults(Country),
);

router.get(
  '/regions',
  searchFilter(['_id', 'localCode', 'name']),
  paginatedResults(Region),
);

export default router;
