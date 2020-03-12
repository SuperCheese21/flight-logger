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

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

const mongoURL = url.format(dbConfig);
console.log(`Connecting to ${mongoURL}...`);
mongoose.connect(mongoURL);

const handleOutput = async (model, oldData, newData) => {
  console.log('Finding nonexistent documents...');
  await Promise.all(
    oldData.map(async ({ _id: id }) => {
      if (!newData.find(row => row[1] === id)) {
        try {
          await model.deleteOne({ _id: id });
          console.log(`  Deleted ${id}`);
        } catch (e) {
          console.error(e);
        }
      }
    }),
  );
  console.log('  Done!');

  console.log('Creating updated documents...');
  await Promise.all(
    newData.map(async row => {
      const update = model.getUpdate(row);
      try {
        await model.findByIdAndUpdate(row[1], update, { upsert: true });
        console.log(`  Upserted ${row[1]}`);
      } catch (e) {
        console.error(e);
      }
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

  await Promise.all(
    collectionNames.map(async name => {
      const model = getModel(name);
      const dataUrl = getDataUrl(name);

      if (!model) {
        return console.log(`Collection ${name} not found! Skipping...`);
      }

      console.log(`Retrieving ${name} from database...`);
      const oldData = await model.find({});
      console.log(`  Done! Number of documents: ${oldData.length}`);

      console.log(`Fetching new data from ${dataUrl}...`);
      const res = await axios.get(dataUrl);
      console.log(`  Done!`);

      const newData = parse(res.data, { skip_empty_lines: true }).slice(1);

      return handleOutput(model, oldData, newData);
    }),
  );
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
