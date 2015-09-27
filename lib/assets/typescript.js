'use strict';

var Bluebird = require('bluebird');
var typescript = require('typescript');

module.exports = Bluebird.method(function (code) {
  return typescript.transpile(code);
});
