/** prepare log folder and file for server message */
const fs = require('fs');

function prepareLogFile() {
  if (!fs.existsSync('logs')) {
    fs.mkdir('logs', (err) => {
      if (err !== null) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  }
  if (!fs.existsSync('logs/Logs.log')) {
    fs.writeFile('logs/Logs.log', '', (err) => {
      if (err !== null) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  }
}

module.exports.prepareLogFile = prepareLogFile;
