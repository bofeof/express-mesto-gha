const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.UnknownError = UnknownError;
