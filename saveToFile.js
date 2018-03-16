var fs = require('fs'),
    moment = require('moment')

const saveToFile = (dataString, filename) => {
  filename = filename?filename:`./export-${moment().format('YYYYMMDD-hmmss')}.csv`
  fs.writeFile(filename, dataString, function(err) {
      if(err) {
          return console.log(err);
      }
  });
}


module.exports = saveToFile