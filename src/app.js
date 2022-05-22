const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const clanningRouter = require('./routes/clanning');

const errorHandler = require('./middleware/errorHander');

const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/clanning/', clanningRouter);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandler);
module.exports = app;
