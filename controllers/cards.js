const Card = require('../models/card');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
const { validateCardId } = require('../utils/errorHandler/validationId/validateCardId');
const { CastError } = require('../utils/errorHandler/CastError');

let error;

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send({ cards: data }))
    .catch((err) => {
      // error = defineError(err, errorAnswers.gettingCardsError);
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => res.send({ card: data }))
    .catch((err) => {
      // error = defineError(err, errorAnswers.creationCardError);
      next(err);
    });
};

module.exports.deleteCardbyId = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  // check if card exists and check owner
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new CastError({
          message: errorAnswers.removingCard,
          logMessage: errorAnswers.removingCard,
        });
      }
      // card exists
      const ownerCardId = card.owner._id.toString();
      if (userId !== ownerCardId) {
        const err = {
          name: 'ForbiddenError',
          message: 'This user doesn\'t have rights to delete card. Only creator has ability to do it',
        };
        error = defineError(err, errorAnswers.forbiddenError);
        next(error);
        return;
      }
      Card.findByIdAndRemove(cardId, (err, removingCard) => {
        // check if id from req is incorrect
        if (!removingCard) {
          const customErr = validateCardId(cardId);
          error = defineError(customErr, errorAnswers.removingCardError);
          next(error);
          return;
        }

        if (err) {
          error = defineError(err, errorAnswers.removingCardError);
          next(error);
          return;
        }

        res.send({ card: removingCard });
      }).populate(['owner', 'likes']);
    })
    .catch((err) => {
      // error = defineError(err, errorAnswers.removingCardError);
      next(err);
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
        error = defineError(customErr, errorAnswers.settingLikeError);
        next(error);
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // error = defineError(err, errorAnswers.settingLikeError);
      next(err);
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
        error = defineError(customErr, errorAnswers.removingLikeError);
        next(error);
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      // error = defineError(err, errorAnswers.removingLikeError);
      next(err);
    });
};
