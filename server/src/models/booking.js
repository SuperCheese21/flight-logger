import mongoose from 'mongoose';

import { TripSchema } from './trip';

const PriceSchema = new mongoose.Schema({
  usd: {
    type: Number,
    required: false,
  },
  local: {
    type: Number,
    required: true,
  },
  currencyCode: {
    type: Number,
    required: true,
  },
});

export const BookingSchema = new mongoose.Schema({
  _id: String,
  trip: {
    type: TripSchema,
    required: true,
  },
  dateBooked: {
    type: Date,
    required: true,
  },
  price: {
    type: PriceSchema,
    required: false,
  },
});

const BookingModel = mongoose.model('Booking', BookingSchema);

export default BookingModel;
