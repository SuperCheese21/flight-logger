import { model, Schema } from 'mongoose';

import { AirlineSchema } from './airline';
import { AirportSchema } from './airport';
import { BookingSchema } from './booking';

export const FlightSchema = new Schema({
  booking: {
    type: BookingSchema,
    required: true,
  },
  departureAirport: {
    type: AirportSchema,
    required: true,
  },
  arrivalAirport: {
    type: AirportSchema,
    required: true,
  },
  airline: AirlineSchema,
  flightNumber: Number,
  callsign: String,
  times: {
    out: {
      type: Date,
      required: true,
    },
    off: Date,
    on: Date,
    in: {
      type: Date,
      required: true,
    },
    block: Number,
    air: Number,
  },
  class: {
    type: String,
    enum: ['first', 'business', 'premium', 'economy', 'basic'],
  },
  seatNumber: String,
  seatPosition: {
    type: String,
    enum: ['aisle', 'middle', 'window'],
  },
  comments: String,
  trackingLink: String,
});

export default model('Flight', FlightSchema, 'flights');
