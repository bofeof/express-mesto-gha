const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const { getAllCards, createCard, deleteCardbyId, likeCard, dislikeCard } = require('../controllers/cards');

cardRouter.get(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getAllCards
);

cardRouter.post(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
  }),
  createCard
);

cardRouter.delete(
  '/:cardId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().required().min(24).max(24),
    }),
  }),
  deleteCardbyId
);

cardRouter.put(
  '/:cardId/likes',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().required().min(24).max(24),
    }),
  }),
  likeCard
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      cardId: Joi.string().required().min(24).max(24),
    }),
  }),
  dislikeCard
);

module.exports = cardRouter;
