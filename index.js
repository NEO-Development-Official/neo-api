// @ts-nocheck
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const firebaseAdmin = require('firebase-admin')
const logger = require('morgan');
const helmet = require('helmet');

const indexRouter = require('./src/routes/index');
const clanningRouter = require('./src/routes/clanning');
const serviceAccount = require('./src/server/serviceAccountKey.json');

const errorHandler = require('./src/middleware/errorHander');

const app = express();
const PORT = 3000;

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://neo-ranking-default-rtdb.firebaseio.com',
})


app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/clanning/', clanningRouter);

app.listen(PORT, () => console.log(`its alive on http://localhost:${PORT}`));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use(errorHandler);
module.exports = app;
