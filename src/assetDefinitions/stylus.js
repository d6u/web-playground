const Bluebird = require('bluebird');
const resolveModule = require('../util/ModuleUtil').resolveModule;
const RenderError = require('../ServeAssets').RenderError;

module.exports = function renderStylus(str) {
  return resolveModule('stylus')
    .then(function (stylus) {
      return Bluebird.fromNode(function (cb) {
        stylus.render(str, cb);
      });
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
