import { model, Schema } from 'mongoose';

import { UserSchema } from './user';

export const TripSchema = new Schema({
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

const TripModel = model('Trip', TripSchema);

export default TripModel;
