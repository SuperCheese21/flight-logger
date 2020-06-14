import { model, Schema } from 'mongoose';

import { parseOurAirportsData } from '../db/parse';
import { getTimeZoneName } from '../utils/serverUtils';

const AirportSchema = new Schema(
  {
    _id: String,
    type: String,
    name: String,
    location: {
      lat: Number,
      lon: Number,
    },
    elevation: Number,
    continent: String,
    country: {
      type: String,
      ref: 'Country',
    },
    region: {
      type: String,
      ref: 'Region',
    },
    municipality: String,
    scheduledService: Boolean,
    codes: {
      ident: String,
      gps: String,
      iata: String,
      local: String,
    },
    wiki: String,
  },
  { toJSON: { virtuals: true } },
);

class Airport {
  get displayCode() {
    const { iata, local } = this.codes;
    return iata || local;
  }

  get timeZone() {
    return getTimeZoneName(this.location);
  }

  static dataUrl = 'https://ourairports.com/data/airports.csv';

  static parseData = parseOurAirportsData;

  static getUpdate = row => ({
    _id: row[1],
    type: row[2],
    name: row[3],
    location: {
      lat: Number(row[4]),
      lon: Number(row[5]),
    },
    elevation: Number(row[6]),
    continent: row[7],
    country: { _id: row[8] },
    region: { _id: row[9] },
    municipality: row[10],
    scheduledService: row[11] === 'yes',
    codes: {
      ident: row[1],
      gps: row[12],
      iata: row[13],
      local: row[14],
    },
    wiki: row[16],
  });

  static getCoordsById(id) {
    const query = this.findById(id)
      .select('location')
      .lean();
    return query.exec();
  }
}

AirportSchema.loadClass(Airport);

export default model('Airport', AirportSchema, 'airports');
