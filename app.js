const { errors, celebrate, Joi } = require('celebrate');
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { errorAnswers } = require('./utils/constants');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { UnknownError } = require('./utils/errorHandler/UnknownError');

const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./utils/errorHandler/NotFoundError');

// CORS
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2000, // 200 reqs per 5 min
  standardHeaders: true,
  legacyHeaders: false,
});

process.on('uncaughtException', (err, origin) => {
  const error = new UnknownError({
    message: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
    logMessage: `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`,
  });
  // eslint-disable-next-line no-console
  console.log(`Непредвиденная ошибка! ${error.message}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');

// set lim of requests
app.use(limiter);
// security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

// CORS
app.use((req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  // res.header('Access-Control-Allow-Origin', "*");

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  next();
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use((req, res, next) => {
  next(new NotFoundError({
    message: errorAnswers.routeError,
  }));
});

app.use(errorLogger);
app.use(errors());

// message for user about some errors
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
