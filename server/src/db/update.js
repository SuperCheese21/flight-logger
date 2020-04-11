import 'regenerator-runtime/runtime';

import axios from 'axios';
import { argv } from 'yargs';

import connectDatabase from './connect';
import models from './models';

const updateModels = async (model, newData) => {
  console.log(`Retrieving old data from database...`);
  const oldData = await model.find({}).exec();
  console.log(`  Done! Number of documents: ${oldData.length}`);

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
  const collectionNames = argv._[0].split(',');

  console.log(collectionNames);

  await Promise.all(
    collectionNames.map(async name => {
      const model = models[name];
      if (!model) {
        return console.error(`Collection ${name} not found! Skipping...`);
      }

      const { dataUrl, getUpdate, parseData } = model;

      console.log(`Fetching new data from ${dataUrl}...`);
      const res = await axios.get(dataUrl);
      console.log('  Done!');

      const data = parseData(res.data).map(item => getUpdate(item));

      return updateModels(model, data);
    }),
  );
};

// Initialize Database
connectDatabase(updateData);
