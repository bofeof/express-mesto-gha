const fs = require('fs');
const { logFile } = require('../constants');

/** write err data to logs/Log.log */
function writeDataToLogFile(statusCode, message) {
  const logData = `${new Date()}: ${statusCode}. ${message} \n`;
  fs.appendFile(logFile, logData, { encoding: 'utf8' }, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
}

module.exports.writeDataToLogFile = writeDataToLogFile;