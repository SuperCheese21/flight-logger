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
    timeZones: [String],
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

AirportSchema.static('dataUrl', 'https://ourairports.com/data/airports.csv');

AirportSchema.static('parseData', parseOurAirportsData);

AirportSchema.static('getUpdate', row => {
  const location = {
    lat: Number(row[4]),
    lon: Number(row[5]),
  };
  const timeZones = geoTz(location.lat, location.lon);
  return {
    _id: row[1],
    type: row[2],
    name: row[3],
    location,
    elevation: Number(row[6]),
    continent: row[7],
    country: { _id: row[8] },
    region: { _id: row[9] },
    municipality: row[10],
    timeZones,
    scheduledService: row[11] === 'yes',
    codes: {
      ident: row[1],
      gps: row[12],
      iata: row[13],
      local: row[14],
    },
    wiki: row[16]
  };
});

AirportSchema.static(
  'findByFlightDiaryString',
  function findByFlightDiaryString(text) {
    const regex = /\([A-Z]{3}\/[A-Z]{4}\)/g;
    const match = text.match(regex);
    if (!match) {
      return null;
    }
    const id = match[0].split('/')[1].split(')')[0];
    return this.findById(id).exec();
  },
);

export default model('Airport', AirportSchema, 'airports');
