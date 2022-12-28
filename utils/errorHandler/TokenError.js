const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenError';
    this.statusCode = 401;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.TokenError = TokenError;
