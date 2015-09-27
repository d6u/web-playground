'use strict';

var preStart = require('./preStart');
var start = require('./start');

module.exports = function () {
  preStart(start);
};
