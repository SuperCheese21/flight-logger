import mongoose from 'mongoose';

import { mongodb as dbConfig } from '../../config.json';

export default callback => {
  // Initialize database
  const { main: mongoURL } = dbConfig;
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);

  console.log(`Connecting to ${mongoURL}...`);
  mongoose.connect(mongoURL);

  // Set error event listener
  mongoose.connection.on('error', () => {
    console.error('  Unable to connect to MongoDB');
  });
  mongoose.connection.once('open', async () => {
    console.log('  Connected!');

    if (callback) {
      await callback();
      mongoose.disconnect();
    }
  });
};
