const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards: cards }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно получить карточки. ${err.name} : ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card: card }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно создать карточку. ${err.name} : ${err.message}`));
};

module.exports.deleteCardbyId = (req, res) => {
  const cardId = req.params.cardId;
  Card.findByIdAndRemove(cardId)
    .populate(['owner', 'likes'])
    .then((card) => res.send({ card: card }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно удалить карточку. ${err.name} : ${err.message}`));
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send({ card: card }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно поставить лайк. ${err.name} : ${err.message}`));
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send({ card: card }))
    .catch((err) => res.status(500).send(`Ошибка. Невозможно снять лайк. ${err.name} : ${err.message}`));
};
