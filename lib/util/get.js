'use strict';

var curryRight = require('lodash/function/curryRight');
var get = require('lodash/object/get');

module.exports = curryRight(get);
