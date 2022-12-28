const Card = require('../models/card');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
const { validateCardId } = require('../utils/errorHandler/validationId/validateCardId');
const { validateUserId } = require('../utils/errorHandler/validationId/validateUserId');

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
  const owner = req.cookies._id;
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
  const userId = req.cookies._id;

  Card.findByIdAndRemove(cardId, (err, removingCard) => {

    // check if id from req is incorrect
    if (!removingCard) {
      const customErr = validateCardId(cardId);
      error = defineError(customErr, errorAnswers.invalidIdError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
      return;
    }
    if (userId !== removingCard.owner._id){
      const err = { name: 'ForbiddenError', message: `This user doesn't have rights to delete card. Only creator has ability to do it` };
      error = defineError(err, errorAnswers.forbiddenError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.forbiddenError}` });
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
  const userId = req.cookies._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in bd
      if (!data) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.cardIdError}` });
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (!!validateCardId(cardId) || !!validateUserId(userId)) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.settingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.settingLikeError}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.cookies._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in bd
      if (!data) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.cardIdError}` });
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (!!validateCardId(cardId) || !!validateUserId(userId)) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.invalidIdError}` });
        return;
      }
      error = defineError(err, errorAnswers.removingLikeError);
      res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.removingLikeError}` });
    });
};
