import express from 'express';
import paginate from 'express-paginate';

import Aircraft from '../../models/aircraft';
import Airline from '../../models/airline';
import Airport from '../../models/airport';
import Country from '../../models/country';
import Region from '../../models/region';

import { paginatedSearchResults, singleResult } from '../../utils/serverUtils';

const router = express.Router();

router.use(paginate.middleware(10, 50));

router.get(
  '/aircraft',
  paginatedSearchResults(Aircraft, ['icao', 'iata', 'names.name']),
);

router.get('/aircraft/:id', singleResult(Aircraft));

router.get(
  '/airlines',
  paginatedSearchResults(Airline, ['icao', 'iata', 'name', 'callsign'], {
    fleetSize: -1,
  }),
);

router.get('/airlines/:id', singleResult(Airline));

router.get(
  '/airports',
  paginatedSearchResults(
    Airport,
    ['_id', 'codes.iata', 'name', 'municipality', 'codes.gps', 'codes.local'],
    { scheduledService: -1 },
  ),
);

router.get('/airports/:id', singleResult(Airport));

router.get('/countries', paginatedSearchResults(Country, ['name', '_id']));

router.get('/countries/:id', singleResult(Country));

router.get(
  '/regions',
  paginatedSearchResults(Region, ['name', 'localCode', '_id']),
);

router.get('/regions/:id', singleResult(Region));

export default router;
