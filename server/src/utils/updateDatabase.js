import 'regenerator-runtime/runtime';

import axios from 'axios';
import { argv } from 'yargs';

import { connectDatabase } from './serverUtils';
import { models, updateDatabase } from './updateUtils';

const updateData = async () => {
  const collectionNames = argv._[0].split(',');

  console.log(collectionNames);

  await Promise.all(
    collectionNames.map(async name => {
      const model = models[name];
      if (!model) {
        return console.error(`Collection ${name} not found! Skipping...`);
      }

      const { dataUrl, parseData } = model;

      console.log(`Fetching new data from ${dataUrl}...`);
      const res = await axios.get(dataUrl);
      console.log('  Done!');

      const data = parseData(res.data);

      return updateDatabase(model, data);
    }),
  );
};

// Initialize Database
connectDatabase(updateData);
