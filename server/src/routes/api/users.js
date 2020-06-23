import express from 'express';

import passport from '../../auth/passport';
import Friends from '../../models/friends';
import User from '../../models/user';

const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }));

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.getUserByUsername(id);
    if (user) {
      res.json(user);
    } else {
      next();
    }
  } catch ({ message }) {
    res.status(500).json({ message });
  }
});

router.put('/:id/add', async (req, res) => {
  const { id: recipientUsername } = req.params;
  const { _id: requesterId } = req.user;
  try {
    await Friends.addFriend(requesterId, recipientUsername);
    res.sendStatus(204);
  } catch ({ status = 500, message }) {
    res.status(status).json({ message });
  }
});

export default router;
