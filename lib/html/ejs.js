'use strict';

var Bluebird = require('bluebird');
var resolve = require('resolve');

module.exports = function renderEjs(code) {
  return Bluebird.try(function () {
    return require('ejs').render(code);
  });
};
