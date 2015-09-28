'use strict';

var Bluebird = require('bluebird');
var coffee = require('coffee-script');

module.exports = Bluebird.method(function (code) {
  return coffee.compile(code);
});
