const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { UnknownError } = require('./utils/errorHandler/UnknownError');
const { WrongRouteError } = require('./utils/errorHandler/WrongRouteError');
const { prepareLogFile } = require('./utils/logPreparation/prepareLogFile');

const { login, createUser } = require('./controllers/users');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200, // 200 reqs per 5 min
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

prepareLogFile();

process.on('uncaughtException', (err, origin) => {
  const error = new UnknownError(
    `${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`
  );
  error.logError();
  console.log(`Непредвиденная ошибка! ${err.message}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');

// for user._id parsing
app.use(cookieParser());

// set lim of requests
app.use(limiter);
// security
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', login);
app.post('/signup', createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use((req, res, next) => {
  const error = new WrongRouteError('Ошибка роутинга. Некорректный url адрес, запрос');
  error.logError();
  const errorForUser = {status: error.statusCode, message: `Ошибка ${error.statusCode}. Некорректный url адрес, запрос` }
  next(errorForUser);
});

  // message for user about some errors
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
