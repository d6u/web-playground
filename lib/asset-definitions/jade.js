'use strict';

var resolveModule = require('../util/Module').resolveModule;

module.exports = function renderJade(str) {
  return resolveModule('jade')
    .then(function (jade) {
      return jade.render(str, {pretty: true});
    });
};
