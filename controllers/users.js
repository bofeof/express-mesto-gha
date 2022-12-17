const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Ошибка. Невозможно получить пользователей. ${err.name} : ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Ошибка. Пользователь не найден по id. ${err.name} : ${err.message}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Ошибка. Пользователь не создан. ${err.name} : ${err.message}` }));
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
    .catch((err) => res.status(500).send({ message: `Ошибка. Пользователь не обновлен. ${err.name} : ${err.message}` }));
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
    .catch((err) => res.status(500).send({ message: `Ошибка. Аватар не обновлен. ${err.name} : ${err.message}` }));
};
