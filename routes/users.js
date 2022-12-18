const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

// return all users
userRouter.get('/', getAllUsers);

// return user using id
userRouter.get('/:userId', getUserById);

// create user
userRouter.post('/', createUser);

// update profile
userRouter.patch('/me', updateProfile);

// update avatar
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
