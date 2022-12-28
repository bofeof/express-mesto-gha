const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.ForbiddenError = ForbiddenError;
