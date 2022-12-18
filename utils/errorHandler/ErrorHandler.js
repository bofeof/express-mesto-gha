const { ValidationError } = require('./ValidationError');
const { CastError } = require('./CastError');
const { InternalServerError } = require('./InternalServerError');

let error;

/** define kind of err from request */
function defineError(err, message) {
  // 400
  if (err.name === 'ValidationError') {
    error = new ValidationError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
    error.logError();
    return error;
  }

  // 404
  if (err.name === 'CastError') {
    error = new CastError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
    error.logError();
    return error;
  }

  // 500
  error = new InternalServerError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
  error.logError();
  return error;
}

module.exports = defineError;
