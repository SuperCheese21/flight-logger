import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import logger from 'morgan';

import router from './routes';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', router);

export default app;
