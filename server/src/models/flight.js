import { model, Schema } from 'mongoose';

import { generateRandomId } from '../utils/serverUtils';

export const FlightSchema = new Schema({
  _id: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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
  outTime: {
    type: Date,
    required: true,
  },
  offTime: Date,
  onTime: Date,
  inTime: {
    type: Date,
    required: true,
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

FlightSchema.static('saveFlight', async function saveFlight(flight) {
  try {
    await flight.save();
  } catch (err) {
    // Duplicate ID error - try to save and generate new ID
    if (err.name === 'MongoError' && err.code === 11000) {
      await this.saveFlight(flight);
    } else {
      throw err;
    }
  }
});

FlightSchema.pre('save', function preSave() {
  this._id = generateRandomId(6);
});

export default model('Flight', FlightSchema, 'flights');
