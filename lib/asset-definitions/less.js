'use strict';

var Bluebird = require('bluebird');
var R = require('ramda');
var resolveModule = require('../util/Module').resolveModule;
var RenderError = require('../ServeAssets').RenderError;

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
