import express from 'express';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import authRouter from './auth';
import dataRouter from './data';

import {
  saveFlight,
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

router.post('/flights', async (req, res) => {
  const userId = req.user._id;
  try {
    const flight = await saveFlight(userId, req.body);
    res.json(flight);
  } catch ({ message, name }) {
    if (name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.json({ message });
  }
});

router.get('/flights/:id', async (req, res, next) => {
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

router.patch('/flights/:id', async (req, res, next) => {
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

router.delete('/flights/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await deleteFlight(id, userId);
    if (!flight) {
      next();
    }
    res.json(flight);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default router;
