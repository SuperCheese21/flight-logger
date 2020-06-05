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
    res.sendStatus(400);
  }
});

router.use('*', (req, res) => {
  const code = req.code || 404;
  const message = req.message || 'Not Found';
  res.status(code).json({ code, message });
});

export default router;
