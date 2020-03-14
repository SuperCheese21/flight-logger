import 'regenerator-runtime/runtime';

import express from 'express';

import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
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
