'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

module.exports = function copy(fromFile, toFile) {
  return Bluebird.fromNode(function (callback) {
    fs.createReadStream(fromFile)
      .pipe(fs.createWriteStream(toFile))
      .on('finish', callback);
  });
};
