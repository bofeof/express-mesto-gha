const cardRouter = require('express').Router();
const {
  getAllCards, createCard, deleteCardbyId, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getAllCards);
cardRouter.post('/', createCard);
cardRouter.delete('/:cardId', deleteCardbyId);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
