import 'regenerator-runtime/runtime';

import Promise from 'bluebird';
import { argv } from 'yargs';

import connectDatabase from './connect';
import models from '../models';
import { fetchData } from '../utils/serverUtils';

const LOGGING_INTERVAL = 1000;
const PROMISE_CONCURRENCY = 10;

const updateCollection = async (model, newDocuments) => {
  // Fetch old documents from database
  console.log(`Fetching old documents from database...`);
  const oldDocuments = await model.find({}, e => e && console.error(e));
  console.log(`  Retrieved ${oldDocuments.length} documents`);

  // Iterate through old documents and find the ones that don't appear in the new documents
  const documentsToDelete = oldDocuments.filter(
    ({ _id }) => !newDocuments.find(({ _id: newId }) => _id === newId),
  );

  // Delete all obsolete documents from database
  console.log(`Removing ${documentsToDelete.length} obsolete documents...`);
  await Promise.all(
    documentsToDelete.map(({ _id }) =>
      model.deleteOne({ _id }, e => e && console.error(e)),
    ),
  );
  console.log('  Done!');

  // Upsert new documents into database
  console.log(`Upserting ${newDocuments.length} documents...`);
  let count = 0;
  await Promise.all(
    newDocuments.map(document =>
      model.updateOne({ _id: document._id }, document, { upsert: true }, e => {
        count += 1;
        if (e) console.error(e);
        else if (
          count === newDocuments.length ||
          count % LOGGING_INTERVAL === 0
        ) {
          console.log(`  ${count}/${newDocuments.length}`);
        }
      }),
    ),
  );
};

const createDocuments = async model => {
  const { dataUrl, getUpdate, parseData } = model;

  console.log(`Fetching data from ${dataUrl} ...`);
  const data = await fetchData(dataUrl);
  if (!data) {
    console.error('Data source not available. Skipping...');
    return [];
  }

  const rows = parseData(data);
  console.log(`  Retrieved ${rows.length} rows`);

  console.log('Creating new documents...');
  const allDocuments = await Promise.map(rows, item => getUpdate(item), {
    concurrency: PROMISE_CONCURRENCY,
  });
  const documents = allDocuments.filter(document => document);
  console.log(`  Created ${documents.length} documents`);

  return documents;
};

const updateData = () => {
  // Parse command line args and filter out collection names that don't exist
  const collectionsToUpdate = argv._[0].split(',').filter(name => models[name]);

  if (collectionsToUpdate.length) {
    console.log(collectionsToUpdate);
  } else {
    console.log('No collections found');
  }

  // Iterate over collection names to update each collection
  return Promise.map(
    collectionsToUpdate,
    async name => {
      console.log(`\nUpdating ${name}`);

      const model = models[name];
      const newDocuments = await createDocuments(model);
      await updateCollection(model, newDocuments);

      console.log(`Finished updating ${name}`);
    },
    {
      concurrency: 1,
    },
  );
};

// Initialize Database
connectDatabase(updateData, true);
