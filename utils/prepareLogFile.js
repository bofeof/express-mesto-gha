/** prepare/create log folder and file for server message */
const fs = require('fs');

module.exports = prepareLogFile = () => {
  if (!fs.existsSync('logs')) {
    fs.mkdir('logs', (err) => {
      if (err !== null) {
        console.log(err);
      }
    });
  }
  if (!fs.existsSync('logs/Logs.log')) {
    fs.writeFile('logs/Logs.log', '', (err) => {
      if (err !== null) {
        console.log(err);
      }
    });
  }
};
