import { readFileSync } from 'fs';

import { model, Schema } from 'mongoose';

export const AircraftSchema = new Schema({
  iata: String,
  icao: String,
  model: String,
});

AircraftSchema.static('getData', () => {
  const csv = readFileSync(`./data/aircraft.csv`);
  return csv;
});

AircraftSchema.static('getUpdate', row => ({
  iata: row[0],
  icao: row[1],
  model: row[2],
}));

export default model('Aircraft', AircraftSchema, 'aircraft');
