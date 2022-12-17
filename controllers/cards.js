const Card = require('../models/card');
const defineError = require('../utils/ErrorHandler');
const errorAnswers = require('../utils/constants').errorAnswers;
let error;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards: cards }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingCardsError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.gettingCardsError}` });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card: card }))
    .catch((err) => {
      error = defineError(err, errorAnswers.creationCardError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.creationCardError}` });
    });
};

module.exports.deleteCardbyId = (req, res) => {
  const cardId = req.params.cardId;

  Card.findByIdAndRemove(cardId, (err, removingCard)=>{
    if(err){
      error = defineError(err, errorAnswers.removingCardError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingCardError}` });
      return
    }
    res.send({ card: removingCard })
  })
    .populate(['owner', 'likes'])
};

module.exports.likeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send({ card: card }))
    .catch((err) => {
      error = defineError(err, errorAnswers.settingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.settingLikeError}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  const cardId = req.params.cardId;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => res.send({ card: card }))
    .catch((err) => {
      error = defineError(err, errorAnswers.removingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingLikeError}` });
    });
};
