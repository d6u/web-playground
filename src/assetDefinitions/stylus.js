const Bluebird = require('bluebird');
const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

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
