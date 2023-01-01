const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class CastError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 404;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.CastError = CastError;
