import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ test: 'lmao' });
});

router.get('/profile', (req, res) => {
  res.sendStatus(200);
});

export default router;
