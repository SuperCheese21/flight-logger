import express from 'express';

import passport from '../../auth/passport';
import {
  saveFlight,
  deleteFlight,
  getFlightById,
  updateFlight,
} from '../../models/flight';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res) => {
  const userId = req.user._id;
  try {
    const flight = await saveFlight(userId, req.body);
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
    const flight = await getFlightById(id);
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await updateFlight(id, userId, req.body);
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await deleteFlight(id, userId);
    if (!flight) {
      next();
    }
    res.sendStatus(204);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
