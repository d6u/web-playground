'use strict';

var Bluebird = require('bluebird');
var resolve = require('resolve');

module.exports = Bluebird.method(function (code) {
  var coffee = require(resolve.sync('coffee-script', {basedir: process.cwd()}));
  return coffee.compile(code);
});
