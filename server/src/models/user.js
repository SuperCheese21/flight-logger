import { model, Schema } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

import AppError from '../utils/error';

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    admin: {
      type: Boolean,
      required: true,
    },
    firstName: String,
    lastName: String,
    privacy: {
      type: String,
      enum: ['public', 'friends', 'private'],
      required: true,
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

class User {
  static async getUserByUsername(username) {
    const query = this.findOne({ username })
      .populate('flights')
      .populate('trips')
      .lean();
    const user = await query.exec();
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }
}

UserSchema.virtual('flights', {
  ref: 'Flight',
  localField: '_id',
  foreignField: 'user',
  options: { sort: { outTime: -1 } },
});

UserSchema.virtual('trips', {
  ref: 'Trip',
  localField: '_id',
  foreignField: 'user',
});

UserSchema.loadClass(User);
UserSchema.plugin(findOrCreate);

export default model('User', UserSchema);
