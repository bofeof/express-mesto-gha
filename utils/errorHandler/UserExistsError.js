const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UserExistsError extends Error {
  constructor({ message, logMessage }) {
    super(message);
    this.name = 'UserExists';
    this.statusCode = 409;
    this.logMessage = logMessage;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.logMessage);
  }
}

module.exports.UserExistsError = UserExistsError;
