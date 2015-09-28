'use strict';

var preStart = require('./preStart');

module.exports = function () {
  preStart(function () {
    require('./start')();
  });
};
