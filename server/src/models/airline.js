import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getAirlineDocument, parseWikipediaData } from '../db/parse';

export const AirlineSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  logo: String,
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', data => {
  const $ = parseWikipediaData(data);
  return $('.wikitable tr').toArray();
});

AirlineSchema.static('getUpdate', async item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const link = tds
    .eq(2)
    .find('a')
    .eq(0);

  const href = link.attr('href');
  if (!href || href.slice(0, 6) !== '/wiki/') {
    return null;
  }

  const name = link.text();

  console.log(`Fetching data for ${name}...`);
  const doc = await getAirlineDocument(href);

  return { name, ...doc };
});

export default model('Airline', AirlineSchema, 'airlines');
