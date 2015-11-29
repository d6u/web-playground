'use strict';

const resolveModule = require('../util/Module').resolveModule;
const RenderError = require('../ServeAssets').RenderError;

module.exports = function renderTypeScript(str) {
  return resolveModule('typescript')
    .then(function (typescript) {
      return typescript.transpile(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
