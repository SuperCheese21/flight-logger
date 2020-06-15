import * as Promise from 'bluebird';
import parse from 'csv-parse/lib/sync';
import { model, Schema } from 'mongoose';

import Aircraft from './aircraft';
import Airline from './airline';
import Airport from './airport';

import { generateRandomId } from '../utils/serverUtils';

export const FlightSchema = new Schema({
  _id: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trip: {
    type: String,
    ref: 'Trip',
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
  reason: {
    type: String,
    enum: ['leisure', 'business', 'crew'],
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

const getSeatPosition = num => {
  switch (num) {
    case 1:
      return 'window';
    case 2:
      return 'middle';
    case 3:
      return 'aisle';
    default:
      return 'window';
  }
};

const getFlightClass = num => {
  switch (num) {
    case 1:
      return 'economy';
    case 2:
      return 'premium';
    case 3:
      return 'business';
    case 4:
      return 'first';
    default:
      return 'basic';
  }
};

const getFlightReason = num => {
  switch (num) {
    case 1:
      return 'leisure';
    case 2:
      return 'business';
    case 3:
      return 'crew';
    default:
      return 'leisure';
  }
};

export const saveFlightDiaryData = (user, csv) => {
  const rows = parse(csv, { skip_empty_lines: true }).slice(1);

  const promises = rows.map(async row => {
    const departureAirport = Airport.getIdFromFlightDiaryString(row[2]);
    const arrivalAirport = Airport.getIdFromFlightDiaryString(row[3]);
    const airline = await Airline.getIdFromFlightDiaryString(row[7]);
    const aircraftType = await Aircraft.getIdFromFlightDiaryString(row[8]);
    const body = {
      user,
      departureAirport,
      arrivalAirport,
      airline,
      flightNumber: Number(row[1].substr(2)),
      aircraftType,
      tailNumber: row[9],
      outTime: `${row[0]}T${row[4]}`,
      inTime: `${row[0]}T${row[5]}`,
      class: getFlightClass(Number(row[12])),
      seatNumber: row[10],
      seatPosition: getSeatPosition(Number(row[11])),
      reason: getFlightReason(Number(row[13])),
    };
    return body;
  });

  return Promise.all(promises);
};

export default Flight;
