import { model, Schema } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

import AppError from '../utils/error';
import { authorize } from '../utils/serverUtils';

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
  static async getUserByUsername(username, user) {
    const query = this.findOne({ username });
    const owner = await query.exec();
    if (!owner) {
      throw new AppError(404, 'User not found');
    }
    const isAuthorized = await authorize(user, owner);
    if (isAuthorized) {
      owner.populate('flights').populate('trips');
    }
    return owner;
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
