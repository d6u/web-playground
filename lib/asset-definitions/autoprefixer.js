'use strict';

var Bluebird = require('bluebird');
var R = require('ramda');
var resolveModule = require('../util/Module').resolveModule;

module.exports = function renderAutoprefixer(str) {
  return Bluebird.join(
    resolveModule('postcss'),
    resolveModule('autoprefixer'),
    function (postcss, autoprefixer) {
      var prefixer = postcss([autoprefixer]);
      return prefixer.process(str);
    })
    .then(R.prop('css'));
};
