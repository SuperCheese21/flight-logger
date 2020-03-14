import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';

export const RegionSchema = new Schema({
  _id: String,
  localCode: String,
  name: String,
  continent: String,
  country: CountrySchema,
});

const RegionModel = model('Region', RegionSchema, 'regions');

RegionModel.getUpdate = row => ({
  _id: row[1],
  localCode: row[2],
  name: row[3],
  continent: row[4],
  country: { _id: row[5] },
});

export default RegionModel;