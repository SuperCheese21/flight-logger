const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  created: Date,
  lastLogin: Date,
});

UserSchema.pre('save', next => {
  const currentDate = new Date();

  if (!this.created) {
    this.created = currentDate;
  }

  if (!this.lastLogin) {
    this.lastLogin = currentDate;
  }

  next();
});

module.exports = mongoose.model('User', UserSchema);
