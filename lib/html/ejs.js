'use strict';

var Bluebird = require('bluebird');
var ejs = require('ejs');

module.exports = function renderEjs(code) {
  return Bluebird.try(function () {
    return ejs.render(code);
  });
};
