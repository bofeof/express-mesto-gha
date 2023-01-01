const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');

const { validateUserId } = require('../utils/errorHandler/validationId/validateUserId');

let error;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      // error = defineError(err, errorAnswers.gettingUsersError);
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // correct id but doesnt exist in bd
      if (!user) {
        const err = validateUserId(userId);
        error = defineError(err, errorAnswers.userIdError);
        next(error);
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      // incorrect id
      // if (userId.length < 24 || userId.length > 24) {
      //   const customErr = validateUserId(userId);
      //   error = defineError(customErr, errorAnswers.userIdError);
      //   next(error);
      //   return;
      // }
      // error = defineError(err, errorAnswers.userIdError);
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // error = defineError(err, errorAnswers.creationUserError);
      next(err);
    }));
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
    },
  )
    .then((data) => res.send({ user: data }))
    .catch((err) => {
      // error = defineError(err, errorAnswers.updatingUserError);
      next(err);
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
    },
  )
    .then((data) => res.send({ user: data }))
    .catch((err) => {
      // incorrect id
      if (userId.length < 24 || userId.length > 24) {
        const custonErr = validateUserId(userId);
        error = defineError(custonErr, errorAnswers.updatingAvatarError);
        next(error);
        return;
      }
      // error = defineError(err, errorAnswers.updatingAvatarError);
      next(err);
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
      // error = defineError(err, errorAnswers.wrongEmailPassword);
      next(err);
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
      // error = defineError(err, errorAnswers.getUserById);
      next(err);
    });
};
