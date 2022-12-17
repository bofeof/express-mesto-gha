const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '/logs/serverLogs.log');

function writeDataToLogFile(message) {
  const log = `${new Date()}: ${message}`;
  fs.writeFile(filepath, log, { encoding: 'utf8' }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// 400
module.exports = class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
  logError() {
    writeDataToLogFile(message);
  }
};

// 404
module.exports = class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 404;
  }

  logError() {
    writeDataToLogFile(message);
  }
};

// 500
module.exports = class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(message);
  }
};

// err from global uncaught Exception
module.exports = class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownError';
    this.statusCode = 500;
  }

  logError() {
    writeDataToLogFile(message);
  }
};
