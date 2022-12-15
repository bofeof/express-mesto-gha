const userRouter = require('express').Router();
const { getAllUsers, getUserById, createUser } = require('../controllers/users')

// app.use('/', userRouter) in app.js

// return all users
userRouter.get('/', getAllUsers);

// return user using id
userRouter.get('/:userId', getUserById);

// create user
userRouter.post('/', createUser);

module.exports = userRouter;
