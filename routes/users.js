const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { getAllUsers, getUserById, updateProfile, updateAvatar, getProfileInfo } = require('../controllers/users');

// return all users
userRouter.get(
  '/',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getAllUsers
);

userRouter.get(
  '/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getProfileInfo
);

// return user using id
userRouter.get(
  '/:userId',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    params: Joi.object().keys({
      userId: Joi.string().required().min(24).max(24),
    }),
  }),
  getUserById
);

// update profile
userRouter.patch(
  '/me',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile
);

// update avatar
userRouter.patch(
  '/me/avatar',
  celebrate({
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
    // body: Joi.object().keys({
    //   avatar: Joi.string().required().uri(),
    // }),
  }),
  updateAvatar
);

module.exports = userRouter;
