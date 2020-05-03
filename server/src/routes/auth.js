import express from 'express';
import passport from 'passport';

const router = express.Router();

router.post('/local', passport.authenticate('local'));

export default router;
