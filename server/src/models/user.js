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

UserSchema.plugin(findOrCreate);

export default model('User', UserSchema);
