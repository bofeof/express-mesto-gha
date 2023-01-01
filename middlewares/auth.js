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
      message: 'Unauthorized error. Authorization (header of request) is required',
    };
    error = defineError(err, errorAnswers.authError);
    next(error);
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'mykey');
  } catch (err) {
    const tokenError = {
      name: 'TokenError',
      message: 'Unauthorized error. Token error',
    };
    error = defineError(tokenError, errorAnswers.tokenError);
    next(error);
    return;
  }

  req.user = payload;

  next();
};
