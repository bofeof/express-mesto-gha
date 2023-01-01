const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class InternalServerError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.InternalServerError = InternalServerError;
