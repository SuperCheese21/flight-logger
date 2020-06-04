import { model, Schema } from 'mongoose';

import { AirlineSchema } from './airline';
import { AirportSchema } from './airport';
import { TripSchema } from './trip';

export const FlightSchema = new Schema({
  _id: String,
  trip: {
    type: TripSchema,
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
  operatorAirline: AirlineSchema,
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
