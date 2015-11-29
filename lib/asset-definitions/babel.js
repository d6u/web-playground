'use strict';

const resolveModule = require('../util/Module').resolveModule;
const RenderError = require('../ServeAssets').RenderError;
const chalk = require('chalk');

module.exports = function renderBabel(str) {
  return resolveModule('babel')
    .then(function (babel) {
      return babel.transform(str).code;
    })
    .catch(function (err) {
      return new RenderError(err.message + '\n' + chalk.stripColor(err.codeFrame));
    });
};
