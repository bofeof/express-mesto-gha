const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class TokenError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'TokenError';
    this.statusCode = 401;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.TokenError = TokenError;
