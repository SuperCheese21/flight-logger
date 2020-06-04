import { model, Schema } from 'mongoose';

export const FlightSchema = new Schema({
  _id: String,
  departureAirport: {
    type: String,
    ref: 'Airport',
    required: true,
  },
  arrivalAirport: {
    type: String,
    ref: 'Airport',
    required: true,
  },
  airline: {
    type: String,
    ref: 'Airline',
  },
  operatorAirline: {
    type: String,
    ref: 'Airline',
  },
  flightNumber: Number,
  callsign: String,
  aircraftType: {
    type: String,
    ref: 'Aircraft',
  },
  tailNumber: String,
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
