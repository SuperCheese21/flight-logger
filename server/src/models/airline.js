import cheerio from 'cheerio';
import { model, Schema } from 'mongoose';

import { getAirlineDocument, parseWikipediaData } from '../db/parse';

const AirlineSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  name: String,
  callsign: String,
  fleetSize: Number,
  destinations: Number,
  logo: String,
  wiki: String,
});

AirlineSchema.static(
  'dataUrl',
  'https://en.wikipedia.org/wiki/List_of_airline_codes',
);

AirlineSchema.static('parseData', data => {
  const $ = parseWikipediaData(data);
  return $('.wikitable tr').toArray().slice(1);
});

AirlineSchema.static('getUpdate', async item => {
  const $ = cheerio.load(item);
  const link = $('td').eq(2).find('a').eq(0);

  const href = link.attr('href');
  if (!href || href.slice(0, 6) !== '/wiki/') {
    return null;
  }

  return getAirlineDocument(href);
});

AirlineSchema.static(
  'findByFlightDiaryString',
  function findByFlightDiaryString(text) {
    const regex = /\([A-Z0-9]{2}\/[A-Z]{3}\)/g;
    const match = text.match(regex);
    if (!match) {
      return null;
    }
    const codes = match[0].split('(')[1].split(')')[0];
    const [iata, icao] = codes.split('/');
    return this.findOne({
      $or: [{ iata, icao }, { iata }],
    })
      .lean()
      .exec();
  },
);

export default model('Airline', AirlineSchema, 'airlines');
