import express from 'express';
import multer from 'multer';

import passport from '../../auth/passport';
import Flight from '../../models/flight';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', async (req, res) => {
  const userId = req.user._id;
  try {
    await Flight.saveFlight(userId, req.body);
    res.sendStatus(201);
  } catch ({ message, name }) {
    if (name === 'ValidationError') {
      res.status(400);
    } else {
      res.status(500);
    }
    res.json({ message });
  }
});

router.post('/upload/flightdiary', upload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'File not found' });
  }
  const csv = req.file.buffer.toString();
  const userId = req.user._id;
  try {
    await Flight.saveFlightDiaryData(userId, csv);
    res.sendStatus(201);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const flight = await Flight.getFlightById(id);
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
    const flight = await Flight.updateFlight(id, userId, req.body);
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
    const flight = await Flight.deleteFlight(id, userId);
    if (!flight) {
      next();
    }
    res.sendStatus(204);
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

export default router;
