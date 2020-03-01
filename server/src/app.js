import path from 'path';

import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';

import apiRouter from './routes/api';
import indexRouter from './routes/index';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

export default app;
