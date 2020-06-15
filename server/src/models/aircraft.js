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

const AircraftSchema = new Schema({
  _id: String,
  iata: String,
  icao: String,
  names: [NameSchema],
});

class Aircraft {
  static dataUrl =
    'https://en.wikipedia.org/wiki/List_of_aircraft_type_designators';

  static parseData = data => {
    const $ = parseWikipediaData(data);
    return $('.wikitable tr')
      .toArray()
      .slice(1);
  };

  static getUpdate = item => {
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
  };

  static async getIdFromFlightDiaryString(text) {
    const regex = /\([A-Z0-9]{3,4}\)/g;
    const match = text.match(regex);
    if (!match) {
      return null;
    }
    const icao = match[0].split('(')[1].split(')')[0];
    const aircraft = await this.findOne({ icao })
      .lean()
      .exec();
    if (!aircraft) {
      return null;
    }
    return aircraft._id;
  }
}

AircraftSchema.loadClass(Aircraft);

export default model('Aircraft', AircraftSchema, 'aircraft');
