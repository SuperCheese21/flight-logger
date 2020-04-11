import parse from 'csv-parse/lib/sync';
import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';

export const RegionSchema = new Schema({
  _id: String,
  localCode: String,
  name: String,
  continent: String,
  country: CountrySchema,
});

RegionSchema.static('dataUrl', 'https://ourairports.com/data/regions.csv');

RegionSchema.static('parseData', data => {
  return parse(data, { skip_empty_lines: true })
    .slice(1)
    .map(row => model.getUpdate(row));
});

RegionSchema.static('getUpdate', row => ({
  _id: row[1],
  localCode: row[2],
  name: row[3],
  continent: row[4],
  country: { _id: row[5] },
}));

export default model('Region', RegionSchema, 'regions');
