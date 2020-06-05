import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import dataRouter from './data';

import Flight from '../models/flight';
import apiSpec from '../../openapi.json';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API home page' });
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
router.use('/data', dataRouter);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/flights', async (req, res) => {
  const user = req.user._id;
  const flight = new Flight({
    user,
    ...req.body,
  });
  try {
    await Flight.saveFlight(flight);
    res.json(flight);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.sendStatus(400);
    }
    res.sendStatus(500);
  }
});

router.patch('/flights/:id', async (req, res, next) => {
  const { id } = req.params;
  const user = req.user._id;
  const query = Flight.findOneAndUpdate({ _id: id, user }, req.body, {
    new: true,
  }).lean();
  try {
    const flight = await query.exec();
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.delete('/flights/:id', async (req, res, next) => {
  const { id } = req.params;
  const query = Flight.findByIdAndDelete(id).lean();
  try {
    const flight = await query.exec();
    if (!flight) {
      next();
    }
    res.sendStatus(204);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.use('*', (req, res) => {
  res.sendStatus(404);
});

export default router;
