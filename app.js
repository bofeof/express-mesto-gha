const path = require('path');
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { UnknownError } = require('./utils/ErrorHandler');
const { WrongRouteError } = require('./utils/ErrorHandler');

const prepareLogFile = require('./utils/prepareLogFile');

prepareLogFile();

process.on('uncaughtException', (err, origin) => {
  const error = new UnknownError(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
  error.logError();
  // eslint-disable-next-line no-console
  console.log(`Непредвиденная ошибка! ${err.message}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
