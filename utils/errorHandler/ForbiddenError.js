const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class ForbiddenError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.ForbiddenError = ForbiddenError;
