import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getText, parseWikipediaData } from '../db/parse';

const NameSchema = new Schema(
  {
    name: String,
    wiki: String,
  },
  { _id: false },
);

export const AircraftSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  names: [NameSchema],
});

AircraftSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_aircraft_type_designators',
);

AircraftSchema.static('parseData', data => {
  const $ = parseWikipediaData(data);
  return $('.wikitable tr')
    .toArray()
    .slice(1);
});

AircraftSchema.static('getUpdate', item => {
  const $ = cheerio.load(item);
  const tds = $('td');
  const icao = getText(tds.eq(0));
  const iata = getText(tds.eq(1));

  if (!icao || !iata) {
    return null;
  }

  const _id = `${iata}_${icao}`;
  const names = tds
    .eq(2)
    .children('a')
    .map((j, a) => {
      const name = $(a).text();
      const href = $(a).attr('href');
      const wiki = `https://en.wikipedia.org${href}`;
      return { name, wiki };
    })
    .get();

  return { _id, iata, icao, names };
});

export default model('Aircraft', AircraftSchema, 'aircraft');
