import 'regenerator-runtime/runtime';

import axios from 'axios';
import cheerio from 'cheerio';
import { argv } from 'yargs';

import { connectDatabase } from './serverUtils';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';

const AIRCRAFT_URL =
  'https://en.wikipedia.org/wiki/List_of_aircraft_type_designators';

const AIRLINES_URL = 'https://en.wikipedia.org/wiki/List_of_airline_codes';

const updateData = async () => {
  const collectionNames = argv._[0].split(',');

  console.log(collectionNames);

  console.log('Fetching wikipedia data');
  const res = await axios.get(AIRCRAFT_URL);
  const html = res.data;

  const $ = cheerio.load(html);
  const aircraft = $('.wikitable tr')
    .map((i, row) => {
      const data = $(row).children('td');
      const icao = data.eq(0).text();
      const iata = data.eq(1).text();
      const names = data
        .children('a')
        .map((j, a) => $(a).text())
        .get();
      return { icao, iata, names };
    })
    .get();

  console.log(aircraft);
};

// Initialize Database
connectDatabase(updateData);
