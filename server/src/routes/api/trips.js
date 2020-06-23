import express from 'express';
import passport from 'passport';

import Trip from '../../models/trip';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res) => {
  const userId = req.user._id;
  try {
    const flight = await Trip.saveTrip(userId, req.body);
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
    const trip = await Trip.getTripById(id);
    if (trip) {
      res.json(trip);
    } else {
      next();
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await Trip.updateTrip(id, userId, req.body);
    if (flight) {
      res.json(flight);
    } else {
      next();
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await Trip.deleteTrip(id, userId);
    if (flight) {
      res.sendStatus(204);
    } else {
      next();
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
