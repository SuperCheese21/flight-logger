import mongoose from 'mongoose';

import { UserSchema } from './user';

const TripSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  user: {
    type: UserSchema,
    required: true,
  },
});

const TripModel = mongoose.model('Trip', TripSchema);

export default TripModel;
