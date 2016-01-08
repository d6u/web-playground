const Bluebird = require('bluebird');
const R = require('ramda');
const resolveModule = require('../util/ModuleUtil').resolveModule;
import { RenderError } from '../Error';

module.exports = function renderLess(str) {
  return resolveModule('less')
    .then(function (less) {
      return Bluebird.fromNode(function (cb) {
        less.render(str, cb);
      });
    })
    .then(R.prop('css'))
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
