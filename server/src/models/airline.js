import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import {
  getAirlineDocument,
  getText,
  parseWikipediaData,
} from '../db/parseData';

export const AirlineSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  logo: String,
});

AirlineSchema.pre('save', next => {
  this._id = `${this.iata}_${this.icao}`; // eslint-disable-line no-underscore-dangle
  next();
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', parseWikipediaData);

AirlineSchema.static('getUpdate', async item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const href = tds
    .eq(2)
    .find('a')
    .eq(0)
    .attr('href');

  if (!href || href.slice(0, 6) !== '/wiki/') {
    return null;
  }

  const iata = getText(tds.eq(0));
  const icao = getText(tds.eq(1));
  const callsign = getText(tds.eq(3));

  const doc = await getAirlineDocument(href);

  return { iata, icao, callsign, ...doc };
});

export default model('Airline', AirlineSchema, 'airlines');
