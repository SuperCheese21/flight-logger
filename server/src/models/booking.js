import axios from 'axios';
import mongoose from 'mongoose';

import { TripSchema } from './trip';

const CURRENCY_API = 'https://api.exchangeratesapi.io/latest?base=USD';

const priceValidator = async value => {
  try {
    const res = await axios.get(CURRENCY_API);
    const codes = Object.keys(res.rates);
    if (codes.includes(value)) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

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
    validate: priceValidator,
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
