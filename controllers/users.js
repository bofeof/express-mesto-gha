const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');

const { ValidationError } = require('../utils/errorHandler/ValidationError');
const { CastError } = require('../utils/errorHandler/CastError');

let error;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingUsersError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.gettingUsersError}` });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // correct id but doesnt exist in bd
      if (!user) {
        const err = { name: 'CastError', message: `User with special id - ${userId} does not exist` };
        error = new CastError(err, errorAnswers.userIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.userIdError}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      // incorrect id
      if (userId.length < 24) {
        error = new ValidationError(err, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.userIdError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.userIdError}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        error = defineError(err, errorAnswers.creationUserError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.creationUserError}` });
      })
  );
};

module.exports.updateProfile = (req, res) => {
  const userId = req.cookies._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((data) => res.send({ user: data }))
    .catch((err) => {
      // incorrect id
      if (userId.length < 24) {
        error = new ValidationError(err, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.updatingUserError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.updatingUserError}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.cookies._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((data) => res.send({ user: data }))
    .catch((err) => {
      // incorrect id
      if (userId.length < 24) {
        error = new ValidationError(err, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.updatingAvatarError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.updatingAvatarError}` });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // create jwt
      const token = jwt.sign({ _id: user._id }, 'mykey', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(err.statusCode).send({ message: `Ошибка ${err.statusCode}. ${errorAnswers.wrongEmailPassword}` });
    });
};

// get data about active user
module.exports.getProfileInfo = (req, res) => {
  const currentUserId = req.cookies._id;
  User.findById(currentUserId)
  .then((user) => {
    res.send({ data: user });
  })
  .catch((err) => {
    // incorrect id
    error = defineError(err, errorAnswers.userIdError);
    res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.userIdError}` });
  });

}
