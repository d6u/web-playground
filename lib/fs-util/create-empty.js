'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

module.exports = function creatEmpty(dest) {
  return Bluebird.fromNode(function (callback) {
    var stream = fs.createWriteStream(dest);
    stream.on('finish', callback);
    stream.write('');
    stream.end();
  });
};
