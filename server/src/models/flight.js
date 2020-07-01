import Promise from 'bluebird';
import parse from 'csv-parse/lib/sync';
import moment from 'moment';
import { model, Schema } from 'mongoose';

import Aircraft from './aircraft';
import Airline from './airline';
import Airport from './airport';

import { generateRandomId, getUTCTime } from '../utils/serverUtils';

const FlightSchema = new Schema({
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
  const inTime = moment(this.inTime);
  if (inTime.isBefore(this.outTime)) {
    this.inTime = inTime.add(24, 'h').format();
  }
  this._id = generateRandomId(6);
});

class Flight {
  static saveFlight(user, body) {
    try {
      return this.create({ user, ...body });
    } catch (err) {
      // Duplicate ID error - try to save and generate new ID
      if (err.name === 'MongoError' && err.code === 11000) {
        return this.saveFlight(user, body);
      }
      throw err;
    }
  }

  static getFlightById(id) {
    const query = this.findById(id)
      .populate('user')
      .populate('departureAirport')
      .populate('arrivalAirport')
      .populate('airline')
      .populate('operatorAirline')
      .populate('aircraftType')
      .lean();
    return query.exec();
  }

  static updateFlight(_id, user, body) {
    const query = this.findOneAndUpdate({ _id, user }, body, {
      new: true,
    }).lean();
    return query.exec();
  }

  static deleteFlight(_id, user) {
    const query = this.findOneAndDelete({ _id, user }).lean();
    return query.exec();
  }

  static getSeatPosition = num => {
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

  static getFlightClass = num => {
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

  static getFlightReason = num => {
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

  static saveFlightDiaryData(user, csv) {
    const rows = parse(csv, { skip_empty_lines: true }).slice(1);

    const promises = rows.map(async row => {
      const departureAirport = await Airport.findByFlightDiaryString(row[2]);
      const arrivalAirport = await Airport.findByFlightDiaryString(row[3]);
      const airline = await Airline.findByFlightDiaryString(row[7]);
      const flightNumber = Number(row[1].substr(2));
      const aircraftType = await Aircraft.findByFlightDiaryString(row[8]);
      const tailNumber = row[9];
      const seatNumber = row[10];
      const body = {
        user,
        departureAirport: departureAirport._id,
        arrivalAirport: arrivalAirport._id,
        ...(airline && { airline: airline._id }),
        ...(flightNumber && { flightNumber }),
        ...(aircraftType && { aircraftType: aircraftType._id }),
        ...(tailNumber && { tailNumber }),
        outTime: getUTCTime(row[0], row[4], departureAirport.timeZone),
        inTime: getUTCTime(row[0], row[5], arrivalAirport.timeZone),
        class: this.getFlightClass(Number(row[12])),
        ...(seatNumber && { seatNumber }),
        seatPosition: this.getSeatPosition(Number(row[11])),
        reason: this.getFlightReason(Number(row[13])),
      };
      return this.create(body);
    });

    return Promise.all(promises);
  }
}

FlightSchema.loadClass(Flight);

export default model('Flight', FlightSchema, 'flights');
