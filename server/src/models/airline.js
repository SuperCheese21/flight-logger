import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { CountrySchema } from './country';

export const AirlineSchema = new Schema({
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  country: CountrySchema,
  comments: String,
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', data => {
  const html = data.replace(/\r?\n|\r|N\/A|n\/a/g, '');
  const $ = cheerio.load(html);
  return $('.wikitable tr')
    .map((i, row) => {
      const tds = $(row).children('td');
      return model.getUpdate($, tds);
    })
    .get();
});

AirlineSchema.static('getUpdate', () => {
  return {};
});

export default model('Airline', AirlineSchema, 'airlines');
