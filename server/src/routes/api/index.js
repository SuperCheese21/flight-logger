import express from 'express';
import swaggerUi from 'swagger-ui-express';

import authRouter from './auth';
import dataRouter from './data';
import flightsRouter from './flights';
import tripsRouter from './trips';
import usersRouter from './users';

import apiSpec from '../../../openapi.json';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API home page' });
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec));
router.use('/auth', authRouter);
router.use('/data', dataRouter);
router.use('/flights', flightsRouter);
router.use('/trips', tripsRouter);
router.use('/users', usersRouter);

router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default router;
