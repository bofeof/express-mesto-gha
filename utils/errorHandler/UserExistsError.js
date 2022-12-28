const { writeDataToLogFile } = require('../logPreparation/writeDataToLogFile');

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserExists';
    this.statusCode = 409;
  }

  logError() {
    writeDataToLogFile(this.statusCode, this.message);
  }
}

module.exports.UserExistsError = UserExistsError;
