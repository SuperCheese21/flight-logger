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

class Airline {
  static dataUrl = 'https://en.wikipedia.org/wiki/List_of_airline_codes';

  static parseData = data => {
    const $ = parseWikipediaData(data);
    return $('.wikitable tr')
      .toArray()
      .slice(1);
  };

  static getUpdate = async item => {
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

    return getAirlineDocument(href);
  };
}

AirlineSchema.loadClass(Airline);

export default model('Airline', AirlineSchema, 'airlines');
