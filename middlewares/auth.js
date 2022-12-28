// check token from request
const jwt = require('jsonwebtoken');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
let error;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = {
      name: 'UnauthorizedError',
      message: `Unauthorized error. Authorization (header of request) is required`,
    };
    error = defineError(err, errorAnswers.authError);
    return res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.authError}` });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'mykey');
  } catch (err) {
    const tokenError = {
      name: 'TokenError',
      message: `Unauthorized error. Token error`,
    };
    error = defineError(tokenError, errorAnswers.tokenError);
    return res.status(error.statusCode).send({ message: `Ошибка ${error.statusCode}. ${errorAnswers.tokenError}` });
  }

  res.cookie('_id', payload, {
    maxAge: 60 * 60 * 1000 * 24 * 7, //7 days
    httpOnly: true,
  });

  next();
};
