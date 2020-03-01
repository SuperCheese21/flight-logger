const mongoose = require('mongoose');

const AirportSchema = new mongoose.Schema({
  _id: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  createdAt: Number,
  updatedAt: Number,
});

module.exports = mongoose.model('Airport', AirportSchema);
