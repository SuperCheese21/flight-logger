import { model, Schema } from 'mongoose';

import { parseOurAirportsData } from '../db/parse';

export const CountrySchema = new Schema({
  _id: String,
  name: String,
  continent: String,
  wiki: String,
});

CountrySchema.static('dataUrl', 'https://ourairports.com/data/countries.csv');

CountrySchema.static('parseData', parseOurAirportsData);

CountrySchema.static('getUpdate', row => ({
  _id: row[1],
  name: row[2],
  continent: row[3],
  wiki: row[4],
}));

export default model('Country', CountrySchema, 'countries');
