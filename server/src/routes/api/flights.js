import express from 'express';
import multer from 'multer';

import passport from '../../auth/passport';
import Flight from '../../models/flight';
import { authenticate } from '../../utils/serverUtils';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:id', authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const flight = await Flight.getFlightById(id, req.user);
    if (flight) {
      res.json(flight);
    } else {
      next();
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res) => {
  const userId = req.user._id;
  try {
    const flight = await Flight.saveFlight(userId, req.body);
    res.status(201).json(flight);
  } catch ({ message, name }) {
    if (name === 'ValidationError') {
      res.status(400).json({ message });
    } else {
      res.status(500).json({ message });
    }
  }
});

router.post('/upload/flightdiary', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'File not found' });
  }
  const csv = req.file.buffer.toString();
  const userId = req.user._id;
  try {
    const flights = await Flight.saveFlightDiaryData(userId, csv);
    res.status(201).json(flights);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    const flight = await Flight.updateFlight(id, userId, req.body);
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
    const flight = await Flight.deleteFlight(id, userId);
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
