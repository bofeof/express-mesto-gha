const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class WrongRouteError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'WrongRouteError';
    this.statusCode = 404;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.WrongRouteError = WrongRouteError;
