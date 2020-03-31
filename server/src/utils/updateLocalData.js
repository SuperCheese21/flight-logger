import 'regenerator-runtime/runtime';

import parse from 'csv-parse/lib/sync';
import { argv } from 'yargs';

import { connectDatabase } from './serverUtils';

import Aircraft from '../models/aircraft';
import Airline from '../models/airline';

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

// Initialize Database
connectDatabase(updateData);
