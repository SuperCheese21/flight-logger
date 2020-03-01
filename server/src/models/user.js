import mongoose from 'mongoose';

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

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
