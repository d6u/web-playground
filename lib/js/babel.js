'use strict';

var Bluebird = require('bluebird');
var babel = require('babel');

module.exports = function renderBabel(code) {
  return Bluebird.try(function () {
    return babel.transform(code).code;
  });
};
