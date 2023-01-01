const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { errorAnswers } = require('../utils/constants');

const { DublicateDataError } = require('../utils/errorHandler/DublicateDataError');
const { CastError } = require('../utils/errorHandler/CastError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      // correct id but doesnt exist in db
      if (!user) {
        next(new CastError({ message: errorAnswers.userIdError }));
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
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
    .then((user) => {
      User.findById(user._id)
        .then((newUser) => {
          res.send({ data: newUser });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      // check 11000, user already exists
      if (err.code === 11000) {
        next(new DublicateDataError({
          message: errorAnswers.creationUserError,
        }));
        return;
      }
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
      next(err);
    });
};
