import 'regenerator-runtime/runtime';

import axios from 'axios';
import { argv } from 'yargs';

import connectDatabase from './connect';
import models from './models';

const updateCollection = async (model, newData) => {
  console.log(`Retrieving old data from database...`);
  const oldData = await model.find({}).exec();
  console.log('  Done!');

  console.log('Removing obsolete documents...');
  await Promise.all(
    oldData.reduce((acc, { _id }) => {
      if (!newData.find(({ _id: newId }) => _id === newId)) {
        const query = model.deleteOne({ _id }, e =>
          e ? console.error(e) : console.log(`  Deleted ${_id}`),
        );
        acc.push(query.exec());
      }
      return acc;
    }, []),
  );
  console.log('Done!');

  console.log('Creating updated documents...');
  await Promise.all(
    newData.map(object => {
      const { _id } = object;
      const query = model.findByIdAndUpdate(_id, object, { upsert: true }, e =>
        e ? console.error(e) : console.log(`  Upserted ${_id}`),
      );
      return query.exec();
    }),
  );
  console.log('Done!');
};

const updateData = async () => {
  const collectionName = argv._[0];

  console.log(`Updating ${collectionName} collection`);

  const model = models[collectionName];
  if (!model) {
    return console.error(`Collection ${collectionName} not found! Skipping...`);
  }

  const { dataUrl, getUpdate, parseData } = model;

  console.log(`Fetching data from ${dataUrl} ...`);
  const res = await axios.get(dataUrl);
  console.log('  Done!');

  const rows = parseData(res.data);

  console.log('Creating new documents...');
  const data = await Promise.all(rows.map(item => getUpdate(item)));
  const documents = data.filter(item => item);
  console.log('  Done!');

  return updateCollection(model, documents);
};

// Initialize Database
connectDatabase(updateData);
