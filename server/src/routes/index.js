import path from 'path';

import express from 'express';

const router = express.Router();

router.use(
  express.static(path.join(__dirname, '..', '..', '..', 'client', 'build')),
);

router.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '..', '..', '..', 'client', 'build', 'index.html'),
  );
});

export default router;
