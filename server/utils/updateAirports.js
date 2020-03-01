const url = require('url');
const mongoose = require('mongoose');
const User = require('../models/user');

const { mongodb: dbConfig } = require('../config.json');

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
