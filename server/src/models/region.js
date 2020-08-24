import { model, Schema } from 'mongoose';

import { parseOurAirportsData } from '../db/parse';

const RegionSchema = new Schema({
  _id: String,
  localCode: String,
  name: String,
  continent: String,
  country: {
    type: String,
    ref: 'Country',
  },
  wiki: String,
});

RegionSchema.static('dataUrl', 'https://ourairports.com/data/regions.csv');

RegionSchema.static('parseData', parseOurAirportsData);

RegionSchema.static('getUpdate', row => ({
  _id: row[1],
  localCode: row[2],
  name: row[3],
  continent: row[4],
  country: { _id: row[5] },
  wiki: row[6],
}));

export default model('Region', RegionSchema, 'regions');
