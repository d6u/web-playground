'use strict';

var fs = require('../promisified/fs');
var curryRight = require('lodash/function/curryRight');

module.exports = curryRight(fs.readFileAsync.bind(fs), 2)({encoding: 'utf8'});
