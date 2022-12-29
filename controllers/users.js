const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');

// const { ValidationError } = require('../utils/errorHandler/ValidationError');
// const { CastError } = require('../utils/errorHandler/CastError');
const { validateUserId } = require('../utils/errorHandler/validationId/validateUserId');

let error;
let errorForUser;

function createErrorForUser(statusCode, errorText) {
  return {
    status: statusCode,
    message: `Ошибка ${statusCode}. ${errorText}`,
  };
}

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingUsersError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.gettingUsersError);
      next(errorForUser);
      return;
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // correct id but doesnt exist in bd
      if (!user) {
        err = validateUserId(userId);
        error = defineError(err, errorAnswers.userIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.userIdError);
        next(errorForUser);
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      // incorrect id
      if (userId.length < 24 || userId.length > 24) {
        err = validateUserId(userId);
        error = defineError(err, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.invalidIdError);
        next(errorForUser);
        return;
      }
      error = defineError(err, errorAnswers.userIdError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.userIdError);
      next(errorForUser);
      return;
    });
};

module.exports.createUser = (req, res, next) => {
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
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.creationUserError);
        next(errorForUser);
        return;
      })
  );
};

module.exports.updateProfile = (req, res, next) => {
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
      if (userId.length < 24 || userId.length > 24) {
        err = validateUserId(userId);
        error = defineError(err, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.invalidIdError);
        next(errorForUser);
        return;
      }
      error = defineError(err, errorAnswers.updatingUserError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.updatingUserError);
      next(errorForUser);
      return;
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (userId.length < 24 || userId.length > 24) {
        err = validateUserId(userId);
        error = defineError(err, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.invalidIdError);
        next(errorForUser);
        return;
      }
      error = defineError(err, errorAnswers.updatingAvatarError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.updatingAvatarError);
      next(errorForUser);
      return;
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // create jwt
      const token = jwt.sign({ _id: user._id }, 'mykey', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      errorForUser = createErrorForUser(err.statusCode, errorAnswers.wrongEmailPassword);
      next(errorForUser);
      return;
    });
};

// get data about active user
module.exports.getProfileInfo = (req, res, next) => {
  const currentUserId = req.cookies._id;
  User.findById(currentUserId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      // incorrect id
      error = defineError(err, errorAnswers.userIdError);
      errorForUser = createErrorForUser(err.statusCode, errorAnswers.userIdError);
      next(errorForUser);
      return;
    });
};
