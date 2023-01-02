const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class NotFoundError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.NotFoundError = NotFoundError;
