const os = require('os');
const fs = require('fs-extra');

function writeJson(fileName, object) {
  fs.writeFileSync(
    fileName,
    JSON.stringify(object, null, 2).replace(/\n/g, os.EOL) + os.EOL
  );
}

module.exports = writeJson;
