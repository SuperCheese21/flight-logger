import geoTz from 'geo-tz';
import { model, Schema } from 'mongoose';

import { parseOurAirportsData } from '../db/parse';

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
  get timeZone() {
    const { lat, lon } = this.location;
    return geoTz(lat, lon)[0];
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

  static findByFlightDiaryString(text) {
    const regex = /\([A-Z]{3}\/[A-Z]{4}\)/g;
    const match = text.match(regex);
    if (!match) {
      return null;
    }
    const id = match[0].split('/')[1].split(')')[0];
    return this.findById(id).exec();
  }
}

AirportSchema.loadClass(Airport);

export default model('Airport', AirportSchema, 'airports');
