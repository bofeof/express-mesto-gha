const Card = require('../models/card');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
const { validateCardId } = require('../utils/errorHandler/validationId/validateCardId');
const { validateUserId } = require('../utils/errorHandler/validationId/validateUserId');

let error;
let errorForUser;

function createErrorForUser(statusCode, errorText) {
  return {
    status: statusCode,
    message: `Ошибка ${statusCode}. ${errorText}`,
  };
}

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send({ cards: data }))
    .catch((err) => {
      error = defineError(err, errorAnswers.gettingCardsError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.gettingCardsError);
      next(errorForUser);
      return;
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => res.send({ card: data }))
    .catch((err) => {
      error = defineError(err, errorAnswers.creationCardError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.creationCardError);
      next(errorForUser);
      return;
    });
};

module.exports.deleteCardbyId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // check if card exists and check owner
  Card.findById(cardId)
    .then((card) => {
      if (userId != card.owner._id) {
        const err = {
          name: 'ForbiddenError',
          message: `This user doesn't have rights to delete card. Only creator has ability to do it`,
        };
        error = defineError(err, errorAnswers.forbiddenError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.forbiddenError);
        next(errorForUser);
        return;
      }

      Card.findByIdAndRemove(cardId, (err, removingCard) => {
        // check if id from req is incorrect
        if (!removingCard) {
          const customErr = validateCardId(cardId);
          error = defineError(customErr, errorAnswers.removingCardError);
          errorForUser = createErrorForUser(error.statusCode, errorAnswers.removingCardError);
          next(errorForUser);
          return;
        }

        if (err) {
          error = defineError(err, errorAnswers.removingCardError);
          errorForUser = createErrorForUser(error.statusCode, errorAnswers.removingCardError);
          next(errorForUser);
          return;
        }
        res.send({ card: removingCard });
      }).populate(['owner', 'likes']);
    })
    .catch((err) => {
      error = defineError(
        { name: 'CastError', message: errorAnswers.removingCardError },
        errorAnswers.removingCardError
      );
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.getCardInfoError);
      next(errorForUser);
      return;
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in db
      if (!data) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.cardIdError);
        next(errorForUser);
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (!!validateCardId(cardId) || !!validateUserId(userId)) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.invalidIdError);
        next(errorForUser);
        return;
      }
      error = defineError(err, errorAnswers.settingLikeError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.settingLikeError);
      next(errorForUser);
      return;
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .populate(['owner', 'likes'])
    .then((data) => {
      // correct id but doesnt exist in db
      if (!data) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.cardIdError);
        next(errorForUser);
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // incorrect ids
      if (!!validateCardId(cardId) || !!validateUserId(userId)) {
        const customErr = validateCardId(cardId);
        error = defineError(customErr, errorAnswers.invalidIdError);
        errorForUser = createErrorForUser(error.statusCode, errorAnswers.invalidIdError);
        next(errorForUser);
        return;
      }
      error = defineError(err, errorAnswers.removingLikeError);
      errorForUser = createErrorForUser(error.statusCode, errorAnswers.removingLikeError);
      next(errorForUser);
      return;
    });
};
