'use strict';

var Bluebird = require('bluebird');

module.exports = function identityAsync(input) {
  return Bluebird.resolve(input);
};
