'use strict';

require('es6-promise').polyfill(); // For postcss

var _        = require('lodash');
var prefixer = require('postcss')([require('autoprefixer')]);
var getCss   = _.partial(_.get, _, 'css');

module.exports = function applyAutoprefixer(str) {
  return prefixer.process(str)
    .then(getCss);
};
