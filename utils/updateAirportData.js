const mongoose = require('mongoose');
const User = require('../models/user');

const DB_DOMAIN = 'flight-logger-1ocmv.mongodb.net';
const DB_NAME = 'main';
const DB_USER = 'root';
const DB_PASSWORD = '43oVW2MAPoKz26TP';

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_DOMAIN}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
