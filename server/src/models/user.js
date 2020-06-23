import { model, Schema } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

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
  static getUserByUsername(username) {
    const query = this.findOne({ username })
      .populate('flights')
      .populate('trips')
      .lean();
    return query.exec();
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
