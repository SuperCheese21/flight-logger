import { model, Schema } from 'mongoose';

export const CountrySchema = new Schema({
  _id: String,
  name: String,
  continent: String,
});

const CountryModel = model('Country', CountrySchema, 'countries');

CountryModel.getUpdate = row => ({
  _id: row[1],
  name: row[2],
  continent: row[3],
});

export default CountryModel;
