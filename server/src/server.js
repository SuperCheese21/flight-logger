import http from 'http';
import url from 'url';

import Debug from 'debug';
import mongoose from 'mongoose';

import app from './app';
import { normalizePort } from './utils/serverUtils';

import { mongodb as dbConfig } from '../config.json';

// Initialize debug logger
const debug = Debug('flight-logger:server');

// Get normalized port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Initialize database
const mongoURL = url.format(dbConfig);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(mongoURL);

// Create http server and start listening
const server = http.createServer(app);
server.listen(port);

// Create event listeners
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
});
server.on('error', err => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
});
