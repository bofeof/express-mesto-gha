const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UnauthorizedError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.UnauthorizedError = UnauthorizedError;
