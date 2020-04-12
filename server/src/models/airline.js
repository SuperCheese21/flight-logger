import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getLogoURL, getText, parseWikipediaData } from '../db/parseData';

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

AirlineSchema.static('parseData', parseWikipediaData);

AirlineSchema.static('getUpdate', async item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const iata = getText(tds.eq(0));
  const icao = getText(tds.eq(1));
  const nameLink = tds
    .eq(2)
    .find('a')
    .eq(0);

  const name = nameLink.text();
  const href = nameLink.attr('href');

  if (!icao || !iata || !name || !href.includes('wiki')) {
    return null;
  }

  const _id = `${iata}_${icao}`; // eslint-disable-line no-underscore-dangle
  const callsign = tds.eq(3).text();

  const logo = await getLogoURL(href);

  return { _id, iata, icao, name, callsign, logo };
});

export default model('Airline', AirlineSchema, 'airlines');
