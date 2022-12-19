const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { UnknownError } = require('./utils/errorHandler/UnknownError');
const { WrongRouteError } = require('./utils/errorHandler/WrongRouteError');
const { prepareLogFile } = require('./utils/logPreparation/prepareLogFile');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 reqs per 5 min
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

prepareLogFile();

process.on('uncaughtException', (err, origin) => {
  const error = new UnknownError(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
  error.logError();
  // eslint-disable-next-line no-console
  console.log(`Непредвиденная ошибка! ${err.message}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');

// set lim of requests
app.use(limiter);
// security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// tmp middleware create user obj for _id extraction, current user id -'639afb28eabb08c97257828c'
app.use((req, res, next) => {
  req.user = {
    _id: '639afb28eabb08c97257828c',
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res, next) => {
  const error = new WrongRouteError('Ошибка роутинга. Некорректный url адрес, запрос');
  error.logError();
  res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. Некорректный url адрес, запрос` });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
