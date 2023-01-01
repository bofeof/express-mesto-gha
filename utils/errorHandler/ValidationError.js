const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class ValidationError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.ValidationError = ValidationError;
