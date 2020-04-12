import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getText, parseWikipediaData } from '../db/parseData';

export const AircraftSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  names: [String],
});

AircraftSchema.pre('save', next => {
  this._id = `${this.iata}_${this.icao}`; // eslint-disable-line no-underscore-dangle
  next();
});

AircraftSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_aircraft_type_designators',
);

AircraftSchema.static('parseData', parseWikipediaData);

AircraftSchema.static('getUpdate', item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const icao = getText(tds.eq(0));
  const iata = getText(tds.eq(1));

  if (!icao || !iata) {
    return null;
  }

  const names = tds
    .eq(2)
    .children('a')
    .map((j, a) => $(a).text())
    .get();

  return { iata, icao, names };
});

export default model('Aircraft', AircraftSchema, 'aircraft');
