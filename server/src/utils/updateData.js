import 'regenerator-runtime/runtime';

import url from 'url';

import axios from 'axios';
import parse from 'csv-parse/lib/sync';
import mongoose from 'mongoose';
import { argv } from 'yargs';

import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';

import { mongodb as dbConfig } from '../../config.json';

const handleOutput = async (model, oldData, newData) => {
  console.log('Removing obsolete documents...');
  await Promise.all(
    oldData.reduce((acc, { _id: id }) => {
      if (!newData.find(row => row[1] === id)) {
        const query = model.deleteOne({ _id: id }, e =>
          e ? console.error(e) : console.log(`  Deleted ${id}`),
        );
        acc.push(query.exec());
      }
      return acc;
    }, []),
  );
  console.log('  Done!');

  console.log('Creating updated documents...');
  await Promise.all(
    newData.map(row => {
      const update = model.getUpdate(row);
      const query = model.findByIdAndUpdate(
        row[1],
        update,
        { upsert: true },
        e => (e ? console.error(e) : console.log(`  Upserted ${row[1]}`)),
      );
      return query.exec();
    }),
  );
  console.log('  Done!');
};

const getModel = collectionName => {
  switch (collectionName) {
    case 'airports':
      return Airport;
    case 'regions':
      return Region;
    case 'countries':
      return Country;
    default:
      return null;
  }
};

const getDataUrl = collectionName =>
  `https://ourairports.com/data/${collectionName}.csv`;

const updateData = async () => {
  const collectionNames = argv._[0].split(',');

  console.log(collectionNames);

  await Promise.all(
    collectionNames.map(async name => {
      const model = getModel(name);
      const dataUrl = getDataUrl(name);

      if (!model) {
        return console.log(`Collection ${name} not found! Skipping...`);
      }

      console.log(`Retrieving ${name} from database...`);
      const oldData = await model.find({}).exec();
      console.log(`  Done! Number of documents: ${oldData.length}`);

      console.log(`Fetching new data from ${dataUrl}...`);
      const res = await axios.get(dataUrl);
      console.log(`  Done!`);

      const newData = parse(res.data, { skip_empty_lines: true }).slice(1);

      return handleOutput(model, oldData, newData);
    }),
  );
};

// Get formatted mongodb URL
const mongoURL = url.format(dbConfig);

// Initiate connection to database
console.log(`Connecting to ${mongoURL}...`);
mongoose.connect(mongoURL);

// Configure database connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

// Set connection event listeners
const db = mongoose.connection;
db.on('error', () => {
  console.error('  connection error');
});
db.once('open', async () => {
  console.log('  Connected!');

  // Start timer and execute update
  const startTime = new Date();

  await updateData();

  const endTime = new Date() - startTime;
  console.log('All databases updated in %dms', endTime);

  // Disconnect from database
  mongoose.disconnect();
});
