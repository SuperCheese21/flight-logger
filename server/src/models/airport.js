import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';
import { RegionSchema } from './region';

export const AirportSchema = new Schema({
  _id: String,
  type: String,
  name: String,
  location: {
    lat: Number,
    lon: Number,
  },
  elevation: Number,
  continent: String,
  country: CountrySchema,
  region: RegionSchema,
  municipality: String,
  scheduledService: Boolean,
  codes: {
    ident: String,
    gps: String,
    iata: String,
    local: String,
  },
});

const AirportModel = model('Airport', AirportSchema, 'airports');

AirportModel.getUpdate = row => ({
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
});

export default AirportModel;
