import 'regenerator-runtime/runtime';

import url from 'url';

import parse from 'csv-parse/lib/sync';
import mongoose from 'mongoose';
import { argv } from 'yargs';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';

import { mongodb as dbConfig } from '../../config.json';

const handleOutput = async (model, csv) => {
  const data = parse(csv, { skip_empty_lines: true }).slice(1);

  await Promise.all(
    data.map(row => {
      const update = model.getUpdate(row);
      return model.create(update, e =>
        e ? console.error(e) : console.log(`  Added ${row[0]}/${row[1]}`),
      );
    }),
  );
};

const getModel = collectionName => {
  switch (collectionName) {
    case 'aircraft':
      return Aircraft;
    case 'airline':
      return Airline;
    default:
      return null;
  }
};

const updateData = async () => {
  const collectionNames = argv._[0].split(',');

  console.log(collectionNames);

  await Promise.all(
    collectionNames.map(async name => {
      const model = getModel(name);

      if (!model) {
        return console.log(`Collection ${name} not found! Skipping...`);
      }

      console.log(`Removing all documents from ${name} collection...`);
      const res = await model.deleteMany({}).exec();
      console.log(`  Done! Number of documents removed: ${res.deletedCount}`);

      console.log(`Fetching new data...`);
      const csv = await model.getData();
      console.log(`  Done!`);

      return handleOutput(model, csv);
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
