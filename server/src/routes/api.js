import 'regenerator-runtime/runtime';

import express from 'express';

import Airport from '../models/airport';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json({ message: 'API home page' });
});

router.get('/airport/:id', async (req, res) => {
  const { id } = req.params;
  const airport = await Airport.findOne({ _id: id }).exec();
  if (airport) {
    res.json(airport);
  } else {
    res.sendStatus(404);
  }
});

export default router;
