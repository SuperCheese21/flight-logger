import url from 'url';
import mongoose from 'mongoose';

import User from '../models/user';
import { mongodb as dbConfig } from '../../config.json';

// Get URL and connect to database
const mongoURL = url.format(dbConfig);
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set event listeners
const db = mongoose.connection;
db.on('error', () => {
  console.error('connection error');
});
db.once('open', () => {
  const user = new User({
    _id: 'SuperCheese21',
    email: 'ethan.shields21@gmail.com',
    password: 'testlmao',
    firstName: 'Ethan',
    lastName: 'Shields',
  });
  user.save();
});
