import { model, Schema } from 'mongoose';

import { parseOurAirportsData } from '../db/parse';

const CountrySchema = new Schema({
  _id: String,
  name: String,
  continent: String,
  wiki: String,
});

class Country {
  static dataUrl = 'https://ourairports.com/data/countries.csv';

  static parseData = parseOurAirportsData;

  static getUpdate = row => ({
    _id: row[1],
    name: row[2],
    continent: row[3],
    wiki: row[4],
  });
}

CountrySchema.loadClass(Country);

export default model('Country', CountrySchema, 'countries');
