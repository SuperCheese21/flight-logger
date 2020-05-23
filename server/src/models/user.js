import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const UserSchema = new mongoose.Schema(
  {
    _id: String,
    googleId: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(findOrCreate);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
