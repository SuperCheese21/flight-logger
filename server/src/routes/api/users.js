import express from 'express';

import passport from '../../auth/passport';
import Friends from '../../models/friends';
import User from '../../models/user';
import { authenticateOptional } from '../../utils/serverUtils';

const router = express.Router();

router.get('/:id', authenticateOptional, async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  try {
    const owner = await User.getUserByUsername(id, user);
    const friends = await Friends.getFriends(owner._id);
    res.json({
      ...owner,
      ...friends,
    });
  } catch (err) {
    next(err);
  }
});

router.use(passport.authenticate('jwt', { session: false }));

router.put('/:id/add', async (req, res, next) => {
  const { id: recipientUsername } = req.params;
  const { _id: requesterId } = req.user;
  try {
    await Friends.addFriend(requesterId, recipientUsername);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/remove', async (req, res, next) => {
  const { id: recipientUsername } = req.params;
  const { _id: requesterId } = req.user;
  try {
    await Friends.removeFriend(requesterId, recipientUsername);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
