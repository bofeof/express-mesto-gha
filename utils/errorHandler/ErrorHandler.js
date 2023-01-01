const { ValidationError } = require('./ValidationError');
const { CastError } = require('./CastError');
const { UserExistsError } = require('./UserExistsError');
const { UnauthorizedError } = require('./UnauthorizedError');
const { InternalServerError } = require('./InternalServerError');
const { TokenError } = require('./TokenError');
const { ForbiddenError } = require('./ForbiddenError');

let error;

/** define kind of err from request */
function defineError(err, message) {
  // 400
  if (err.name === 'ValidationError') {
    error = new ValidationError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 400 - can't registrate user again
  if (err.code === 11000) {
    error = new UserExistsError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 401 - login error
  if (err.name === 'UnauthorizedError') {
    error = new UnauthorizedError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 401 token error
  if (err.name === 'TokenError') {
    error = new TokenError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 403
  if (err.name === 'ForbiddenError') {
    error = new ForbiddenError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 404
  if (err.name === 'CastError') {
    error = new CastError({
      message: `Ошибка. ${message}`,
      logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
    });
    error.logError();
    return error;
  }

  // 500
  error = new InternalServerError({
    message: `Ошибка. ${message}`,
    logMessage: `Ошибка. ${message}. ${err.name} : ${err.message}`,
  });
  error.logError();
  return error;
}

module.exports = defineError;
