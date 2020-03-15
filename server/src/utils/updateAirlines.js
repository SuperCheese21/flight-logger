import 'regenerator-runtime/runtime';

import { readFileSync } from 'fs';
import url from 'url';

import parse from 'csv-parse/lib/sync';
import mongoose from 'mongoose';

import Airline from '../models/airline';

import { mongodb as dbConfig } from '../../config.json';

const updateData = async () => {
  console.log(`Removing airlines from database...`);
  const res = await Airline.deleteMany({}).exec();
  console.log(`  Done! Number of documents removed: ${res.deletedCount}`);

  console.log(`Fetching data from airlines.csv...`);
  const csv = readFileSync('./data/airlines.csv');
  console.log(`  Done!`);

  const data = parse(csv, { skip_empty_lines: true }).slice(1);

  await Promise.all(
    data.map(row => {
      const update = Airline.getUpdate(row);
      return Airline.create(update, e =>
        e ? console.error(e) : console.log(`  Added ${row[0]}/${row[1]}`),
      );
    }),
  );
};

// Get formatted mongodb URL
const mongoURL = url.format(dbConfig);

// Configure database connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

// Initiate connection to database
console.log(`Connecting to ${mongoURL}...`);
mongoose.connect(mongoURL);

// Set connection event listeners
const db = mongoose.connection;
db.on('error', () => {
  console.error('  connection error');
});
db.once('open', async () => {
  console.log('  Connected!');
  updateData();
});
