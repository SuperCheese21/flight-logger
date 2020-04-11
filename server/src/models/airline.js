import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getText, parseWikipediaData } from '../db/parseData';

export const AirlineSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  name: String,
  callsign: String,
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', parseWikipediaData);

AirlineSchema.static('getUpdate', item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const iata = getText(tds.eq(0));
  const icao = getText(tds.eq(1));
  const name = tds
    .eq(2)
    .children('a')
    .eq(0)
    .text();

  if (!icao || !iata || !name) {
    return null;
  }

  const _id = `${iata}_${icao}`; // eslint-disable-line no-underscore-dangle
  const callsign = getText(tds.eq(3));

  return { _id, icao, iata, name, callsign };
});

export default model('Airline', AirlineSchema, 'airlines');
