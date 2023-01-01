const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UnknownError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UnknownError';
    this.statusCode = 500;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.UnknownError = UnknownError;
