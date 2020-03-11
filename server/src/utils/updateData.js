import 'regenerator-runtime/runtime';

import url from 'url';

import axios from 'axios';
import parse from 'csv-parse/lib/sync';
import mongoose from 'mongoose';
import { argv } from 'yargs';

import Airport from '../models/airport';

import { mongodb as dbConfig } from '../../config.json';

const AIRPORTS_URL = name => `https://ourairports.com/data/${name}.csv`;

// Get URL and connect to database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const mongoURL = url.format(dbConfig);
console.log(`Connecting to ${mongoURL}...`);
mongoose.connect(mongoURL);

const handleOutput = async (oldData, newData) => {
  console.log('Finding nonexistent airports in database...');
  const deletePromises = oldData.reduce((acc, airport) => {
    // eslint-disable-next-line no-underscore-dangle
    const ident = airport._id;
    if (!newData.find(row => row[1] === ident)) {
      acc.push(
        Airport.deleteOne({ _id: ident }, err => {
          if (err) {
            console.error(err);
          } else {
            console.log(`  Deleted ${ident}`);
          }
        }),
      );
    }
    return acc;
  }, []);
  await Promise.all(deletePromises);
  console.log('  Done!');

  console.log('Creating new airport objects...');
  const upsertPromises = newData.reduce((acc, row) => {
    const ident = row[1];
    const update = {
      _id: ident,
      type: row[2],
      name: row[3],
      location: {
        lat: Number(row[4]),
        lon: Number(row[5]),
      },
      elevation: Number(row[6]),
      continent: row[7],
      country: row[8],
      region: row[9],
      municipality: row[10],
      scheduledService: row[11] === 'yes',
      codes: {
        ident,
        gps: row[12],
        iata: row[13],
        local: row[14],
      },
    };
    acc.push(
      Airport.findByIdAndUpdate(ident, update, { upsert: true }, err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`  Upserted ${ident}`);
        }
      }),
    );
    return acc;
  }, []);
  await Promise.all(upsertPromises);
  console.log('  Done!');
};

const updateData = async () => {
  const collections = argv._[0].split(',');
  console.log(collections);
  try {
    console.log('Retrieving all airports from database...');
    const oldData = await Airport.find({});
    console.log(`  Done! Number of airports: ${oldData.length}`);

    console.log(`Fetching new data from ${AIRPORTS_URL}...`);
    const res = await axios.get(AIRPORTS_URL);
    console.log(`  Done!`);

    const newData = parse(res.data, { skip_empty_lines: true }).slice(1);
    await handleOutput(oldData, newData);
  } catch (e) {
    console.error(e);
  }
};

// Set event listeners
const db = mongoose.connection;
db.on('error', () => {
  console.error('  connection error');
});
db.once('open', () => {
  console.log('  Connected!');
  updateData();
});
