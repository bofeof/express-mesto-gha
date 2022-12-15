const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
    User.find({})
    .then(users => res.send({data: users}))
    .catch(err => res.status(500).send({message: `Ошибка. Невозможно получить пользователей. ${err.message}`}))
};

module.exports.getUserById = (req, res) => {
    User.findById(req.params._id)
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: `Ошибка. Пользователь не найден по id. ${err.message}`}))
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: `Ошибка. Пользователь не создан. ${err.message}`}))
};