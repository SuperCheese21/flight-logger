import 'regenerator-runtime/runtime';

import axios from 'axios';
import cheerio from 'cheerio';
import parse from 'csv-parse/lib/sync';
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

      const url = model.dataUrl;

      console.log(`Fetching new data from ${url}...`);
      const res = await axios.get(url);
      console.log(`  Done!`);

      let data;
      if (url.includes('ourairports')) {
        data = parse(res.data, { skip_empty_lines: true })
          .slice(1)
          .map(row => model.getUpdate(row));
      } else if (url.includes('wikipedia')) {
        const html = res.data.replace(/\r?\n|\r|N\/A|n\/a/g, '');
        const $ = cheerio.load(html);
        data = $('.wikitable tr')
          .map((i, row) => {
            const tds = $(row).children('td');
            return model.getUpdate($, tds);
          })
          .get();
      }

      return updateDatabase(model, data);
    }),
  );
};

// Initialize Database
connectDatabase(updateData);
