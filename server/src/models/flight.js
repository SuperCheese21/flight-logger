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

FlightSchema.pre('save', function preSave() {
  this._id = generateRandomId(6);
});

const Flight = model('Flight', FlightSchema, 'flights');

export const saveFlight = async (user, body) => {
  try {
    return Flight.create({ user, ...body });
  } catch (err) {
    // Duplicate ID error - try to save and generate new ID
    if (err.name === 'MongoError' && err.code === 11000) {
      return saveFlight(user, body);
    }
    throw err;
  }
};

export const getFlightById = id => {
  const query = Flight.findById(id)
    .populate('user')
    .populate('departureAirport')
    .populate('arrivalAirport')
    .populate('airline')
    .populate('operatorAirline')
    .populate('aircraftType')
    .lean();
  return query.exec();
};

export const updateFlight = (_id, user, body) => {
  const query = Flight.findOneAndUpdate({ _id, user }, body, {
    new: true,
  }).lean();
  return query.exec();
};

export const deleteFlight = (_id, user) => {
  const query = Flight.findOneAndDelete({ _id, user }).lean();
  return query.exec();
};

export default Flight;
