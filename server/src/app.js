import path from 'path';

import cookieParser from 'cookie-parser';
import express from 'express';
import flash from 'connect-flash';
import logger from 'morgan';

import apiRouter from './routes/api';
import authRouter from './routes/auth';
import indexRouter from './routes/index';

const app = express();

app.use(logger('dev'));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);

export default app;
