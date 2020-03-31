import mongoose from 'mongoose';

import { mongodb as dbConfig } from '../../config.json';

export const connectDatabase = callback => {
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

export const normalizePort = val => {
  const newPort = parseInt(val, 10);

  if (Number.isNaN(newPort)) {
    return val;
  }

  if (newPort >= 0) {
    return newPort;
  }

  return false;
};
