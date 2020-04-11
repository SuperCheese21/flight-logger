import parse from 'csv-parse/lib/sync';
import { model, Schema } from 'mongoose';

export const CountrySchema = new Schema({
  _id: String,
  name: String,
  continent: String,
});

CountrySchema.static('dataUrl', 'https://ourairports.com/data/countries.csv');

CountrySchema.static('parseData', data => {
  return parse(data, { skip_empty_lines: true })
    .slice(1)
    .map(row => model.getUpdate(row));
});

CountrySchema.static('getUpdate', row => ({
  _id: row[1],
  name: row[2],
  continent: row[3],
}));

export default model('Country', CountrySchema, 'countries');
