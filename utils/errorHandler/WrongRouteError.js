const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class WrongRouteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongRouteError';
    this.statusCode = 404;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.WrongRouteError = WrongRouteError;
