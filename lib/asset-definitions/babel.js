'use strict';

var resolveModule = require('../util/Module').resolveModule;
var RenderError = require('../ServeAssets').RenderError;
var chalk = require('chalk');

module.exports = function renderBabel(str) {
  return resolveModule('babel')
    .then(function (babel) {
      return babel.transform(str).code;
    })
    .catch(function (err) {
      return new RenderError(err.message + '\n' + chalk.stripColor(err.codeFrame));
    });
};
