import express from 'express';
import passport from 'passport';

import Trip from '../../models/trip';
import { authenticateEntity } from '../../utils/serverUtils';

const router = express.Router();

router.get(
  '/:id',
  async (req, res, next) => {
    const { id } = req.params;
    const query = Trip.getTripById(id);
    req.query = query;
    next();
  },
  authenticateEntity,
);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res, next) => {
  const userId = req.user._id;
  try {
    const trip = await Trip.saveTrip(userId, req.body);
    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const trip = await Trip.updateTrip(id, userId, req.body);
    res.json(trip);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    await Trip.deleteTrip(id, userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
