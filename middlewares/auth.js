// check token from request
const jwt = require('jsonwebtoken');
const defineError = require('../utils/errorHandler/ErrorHandler');
const { errorAnswers } = require('../utils/constants');
let error;
let errorForUser;

function createErrorForUser(statusCode, errorText) {
  return {
    status: statusCode,
    message: `Ошибка ${statusCode}. ${errorText}`,
  };
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = {
      name: 'UnauthorizedError',
      message: `Unauthorized error. Authorization (header of request) is required`,
    };
    error = defineError(err, errorAnswers.authError);
    errorForUser = createErrorForUser(error.statusCode, errorAnswers.authError);
    next(errorForUser);
    return;
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
    errorForUser = createErrorForUser(error.statusCode, errorAnswers.tokenError);
    next(errorForUser);
    return;
  }

  req.user = payload;

  next();
};
