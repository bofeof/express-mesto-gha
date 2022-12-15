const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards: cards }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно получить карточки. ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card: card }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно создать карточку. ${err.message}`));
};

module.exports.deleteCardbyId = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndRemove(cardId);
  then((card) => res.send({ card: card })).catch((err) => res.status(500).send(`Ошибка. Невозможно удалить карточку. ${err.message}`));
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
};
