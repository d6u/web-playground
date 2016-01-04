'use strict';

const resolveModule = require('../util/ModuleUtil').resolveModule;
const RenderError = require('../ServeAssets').RenderError;

module.exports = function renderJade(str) {
  return resolveModule('jade')
    .then(function (jade) {
      return jade.render(str, {pretty: true});
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
