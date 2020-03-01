const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    _id: String,
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
