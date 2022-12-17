const fs = require('fs');
const logFile = require('../utils/constants').logFile

/** write err data to logs/Log.log */
function writeDataToLogFile(statusCode, message) {
  const logData = `${new Date()}: ${statusCode}. ${message} \n`;
  fs.appendFile(logFile, logData, { encoding: 'utf8' }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

/** define kind of err from request */
module.exports = function defineError(err, message) {
  //400
  if (err.name === 'ValidationError') {
    error = new ValidationError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
    error.logError();
    return error;
  }

  //404
  if (err.name === 'CastError') {
    error = new CastError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
    error.logError();
    return error;
  }

  //500
  error = new InternalServerError(`Ошибка. ${message}. ${err.name} : ${err.message}`);
  error.logError();
  return error;
};

/** Errors */
/** 400 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

/** 404 */
class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 404;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

/** 500 */
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

/** err from global uncaught Exception -  ? */
class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}
