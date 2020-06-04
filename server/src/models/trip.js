import { model, Schema } from 'mongoose';

export const TripSchema = new Schema({
  _id: String,
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
