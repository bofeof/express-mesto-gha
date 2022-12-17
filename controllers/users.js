const User = require('../models/user');
const defineError = require('../utils/ErrorHandler');
const errorAnswers = require('../utils/constants').errorAnswers;
let error;

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingUsersError)
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.gettingUsersError}` });
    });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      error = defineError(err, errorAnswers.userIdError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.userIdError}` });
})};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      error = defineError(err, errorAnswers.creationUserError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.creationUserError}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ user: user }))
    .catch((err) => {
      error = defineError(err, errorAnswers.updatingUserError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${ errorAnswers.updatingUserError}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ user: user }))
    .catch((err) => {
      error = defineError(err, errorAnswers.updatingAvatarError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${ errorAnswers.updatingAvatarError}` });
    });
};
