const path = require('path');
const process = require('process');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

// routers
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', userRouter);
app.use('/cards', cardRouter);

// tmp middleware create user obj for _id extraction
app.use((req, res, next) => {
  req.user = {
    _id: '639afb28eabb08c97257828c'
  };

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
