'use strict';

var resolveModule = require('../util/Module').resolveModule;

module.exports = function renderEjs(str) {
  return resolveModule('ejs')
    .then(function (ejs) {
      return ejs.render(str);
    });
};
