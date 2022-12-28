const userRouter = require('express').Router();
const {
  getAllUsers, getUserById, updateProfile, updateAvatar,getProfileInfo
} = require('../controllers/users');

// return all users
userRouter.get('/', getAllUsers);

userRouter.get('/me', getProfileInfo);

// return user using id
userRouter.get('/:userId', getUserById);

// update profile
userRouter.patch('/me', updateProfile);

// update avatar
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
