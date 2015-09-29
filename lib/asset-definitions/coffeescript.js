'use strict';

var resolveModule = require('../util/Module').resolveModule;
var RenderError = require('../ServeAssets').RenderError;

module.exports = function renderCoffee(str) {
  return resolveModule('coffee-script')
    .then(function (coffee) {
      return coffee.compile(str);
    })
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
