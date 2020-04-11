import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';

import { parseWikipediaData } from '../db/parseData';

export const AirlineSchema = new Schema({
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  country: CountrySchema,
  comments: String,
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', parseWikipediaData);

AirlineSchema.static('getUpdate', () => {
  return {};
});

export default model('Airline', AirlineSchema, 'airlines');
