import Aircraft from '../models/aircraft';
import Airline from '../models/airline';
import Airport from '../models/airport';
import Country from '../models/country';
import Region from '../models/region';

export const models = {
  aircraft: Aircraft,
  airlines: Airline,
  airports: Airport,
  countries: Country,
  regions: Region,
};

export const updateDatabase = async (model, newData) => {
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
