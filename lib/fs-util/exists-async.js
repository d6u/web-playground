'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

module.exports = function exists(file) {
  return Bluebird.fromNode(function (callback) {
    fs.exists(file, function (exists) {
      callback(null, exists);
    });
  });
};
