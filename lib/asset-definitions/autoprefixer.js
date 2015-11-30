'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const resolveModule = require('../util/Module').resolveModule;

module.exports = function renderAutoprefixer(str) {
  return Bluebird.join(
    resolveModule('postcss'),
    resolveModule('autoprefixer'),
    function (postcss, autoprefixer) {
      const prefixer = postcss([autoprefixer]);
      return prefixer.process(str);
    })
    .then(R.prop('css'));
};
