import express from 'express';
import multer from 'multer';

import passport from '../../auth/passport';
import Flight from '../../models/flight';
import { authenticateEntity } from '../../utils/serverUtils';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get(
  '/:id',
  (req, res, next) => {
    const { id } = req.params;
    const query = Flight.getFlightById(id);
    req.query = query;
    next();
  },
  authenticateEntity,
);

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res, next) => {
  const userId = req.user._id;
  try {
    const flight = await Flight.saveFlight(userId, req.body);
    res.status(201).json(flight);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/upload/flightdiary',
  upload.single('file'),
  async (req, res, next) => {
    const { file } = req;
    const userId = req.user._id;
    try {
      const flights = await Flight.saveFlightDiaryData(userId, file);
      res.status(201).json(flights);
    } catch (err) {
      next(err);
    }
  },
);

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await Flight.updateFlight(id, userId, req.body);
    res.json(flight);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    await Flight.deleteFlight(id, userId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
