import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import authRouter from './auth';
import dataRouter from './data';

import Flight, {
  deleteFlight,
  getFlightById,
  updateFlight,
} from '../../models/flight';
import apiSpec from '../../../openapi.json';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API home page' });
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
router.use('/auth', authRouter);
router.use('/data', dataRouter);

router.use(passport.authenticate('jwt', { session: false }));

router.get('/flights/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const flight = await getFlightById(id);
    if (!flight) {
      next('fdsfsfsdf');
    }
    res.json(flight);
  } catch (err) {
    res.sendStatus(500);
  }
});

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
  try {
    const flight = await updateFlight(id, user, req.body);
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
  try {
    const flight = await deleteFlight(id);
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.use('*', (req, res) => {
  console.log({ req });
  res.sendStatus(404);
});

export default router;
