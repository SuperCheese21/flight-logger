import express from 'express';
import passport from 'passport';

import { getTripById, saveTrip, updateTrip } from '../../models/trip';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res) => {
  const userId = req.user._id;
  try {
    const flight = await saveTrip(userId, req.body);
    res.status(201).json(flight);
  } catch ({ message, name }) {
    if (name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.json({ message });
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const trip = await getTripById(id);
    if (!trip) {
      next();
    }
    res.json(trip);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await updateTrip(id, userId, req.body);
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
