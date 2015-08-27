'use strict';

var Bluebird = require('bluebird');
var swig = require('swig');

module.exports = function renderSwig(code) {
  return Bluebird.try(function () {
    return swig.render(code);
  });
};
