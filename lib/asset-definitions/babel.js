'use strict';

var Bluebird = require('bluebird');
var babel = require('babel');

module.exports = Bluebird.method(function (code) {
  return babel.transform(code).code;
});
