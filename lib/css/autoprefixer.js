'use strict';

var Bluebird = require('bluebird');
var autoprefixer = require('autoprefixer-core');
var getCss = require('../util/get')('css', null);

module.exports = function renderAutoprefixer(code) {
  return Bluebird.try(function () {
    return autoprefixer.process(code).then(getCss);
  });
};
