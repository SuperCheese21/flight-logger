import { model, Schema } from 'mongoose';

export const CountrySchema = new Schema({
  _id: String,
  name: String,
  continent: String,
});

CountrySchema.static('dataUrl', 'https://ourairports.com/data/countries.csv');

CountrySchema.static('getUpdate', row => ({
  _id: row[1],
  name: row[2],
  continent: row[3],
}));

export default model('Country', CountrySchema, 'countries');
