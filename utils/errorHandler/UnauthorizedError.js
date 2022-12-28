const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.UnauthorizedError = UnauthorizedError;
