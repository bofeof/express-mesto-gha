const Card = require('../models/card');
const defineError = require('../utils/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
const { ValidationError } = require('../utils/ErrorHandler');
const { CastError } = require('../utils/ErrorHandler');

let error;

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send({ cards: data }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingCardsError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.gettingCardsError}` });
    });
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => res.send({ card: data }))
    .catch((err) => {
      error = defineError(err, errorAnswers.creationCardError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.creationCardError}` });
    });
};

module.exports.deleteCardbyId = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId, (err, removingCard) => {
    // incorrect id
    let customErr;
    if (cardId.length < 24) {
      customErr = { name: 'ValidationError', message: `Card with special id - ${cardId} does not exist` };
      error = defineError(customErr, errorAnswers.invalidIdError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
      return;
    }
    // if card doesnt exist
    if (!removingCard) {
      customErr = { name: 'CastError', message: `Card with special id - ${cardId} does not exist` };
      error = defineError(customErr, errorAnswers.removingCardError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingCardError}` });
      return;
    }
    if (err) {
      error = defineError(err, errorAnswers.removingCardError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingCardError}` });
      return;
    }
    res.send({ card: removingCard });
  }).populate(['owner', 'likes']);
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in bd
      if (!data) {
        const err = { name: 'CastError', message: `Card with special id - ${cardId} does not exist` };
        error = new CastError(err, errorAnswers.cardIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.cardIdError}` });
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (cardId.length < 24 || userId.length < 24) {
        error = new ValidationError(err, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.settingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.settingLikeError}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in bd
      if (!data) {
        const err = { name: 'CastError', message: `Card with special id - ${cardId} does not exist` };
        error = new CastError(err, errorAnswers.cardIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.cardIdError}` });
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (cardId.length < 24 || userId.length < 24) {
        error = new ValidationError(err, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.removingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingLikeError}` });
    });
};
