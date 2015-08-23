'use strict';

var Bluebird = require('bluebird');

module.exports = function identifyPromise(input) {
  return Bluebird.resolve(input);
};
