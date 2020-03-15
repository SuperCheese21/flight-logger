import { readFileSync } from 'fs';

import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';

export const AirlineSchema = new Schema({
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  country: CountrySchema,
  comments: String,
});

AirlineSchema.static('getData', () => {
  const csv = readFileSync(`./data/airline.csv`);
  return csv;
});

AirlineSchema.static('getUpdate', row => ({
  iata: row[0],
  icao: row[1],
  name: row[2],
  callsign: row[3],
  country: { name: row[4] },
  comments: row[5],
}));

export default model('Airline', AirlineSchema, 'airlines');
