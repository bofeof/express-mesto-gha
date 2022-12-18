const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 404;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.CastError = CastError;
