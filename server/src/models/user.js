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
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    privacy: {
      type: String,
      enum: ['public', 'friends', 'private'],
    },
    admin: {
      type: Boolean,
      required: false,
    },
    trips: [
      {
        type: String,
        ref: 'Trip',
      },
    ],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(findOrCreate);

export default model('User', UserSchema);
