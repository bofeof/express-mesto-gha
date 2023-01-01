const Card = require('../models/card');
const { errorAnswers } = require('../utils/constants');
const { CastError } = require('../utils/errorHandler/CastError');
const { ForbiddenError } = require('../utils/errorHandler/ForbiddenError');
const { ValidationError } = require('../utils/errorHandler/ValidationError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((data) => res.send({ cards: data }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((data) => res.send({ card: data }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError({ message: err.message }));
        return;
      }
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
        next(new CastError({ message: errorAnswers.removingCardError }));
        return;
      }
      // card exists
      const ownerCardId = card.owner._id.toString();
      if (userId !== ownerCardId) {
        next(new ForbiddenError({ message: errorAnswers.forbiddenError }));
        return;
      }

      // removing
      Card.findByIdAndRemove(cardId, (err, removingCard) => {
        if (err) {
          next(err);
          return;
        }
        res.send({ card: removingCard });
      }).populate(['owner', 'likes']);
    })
    .catch((err) => {
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
        next(new CastError({ message: errorAnswers.settingLikeError }));
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
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
        next(new CastError({ message: errorAnswers.removingLikeError }));
        return;
      }
      res.send({ card: data });
    })
    .catch((err) => {
      next(err);
    });
};
