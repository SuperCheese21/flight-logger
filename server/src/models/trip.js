import { model, Schema } from 'mongoose';

export const TripSchema = new Schema({
  _id: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  flights: [
    {
      type: String,
      ref: 'Flight',
    },
  ],
});

const TripModel = model('Trip', TripSchema);

export default TripModel;
