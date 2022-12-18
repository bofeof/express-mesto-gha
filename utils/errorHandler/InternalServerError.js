const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.InternalServerError = InternalServerError;
