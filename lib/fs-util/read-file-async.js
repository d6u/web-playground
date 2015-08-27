'use strict';

var _ = require('lodash');
var fs = require('./fs');

module.exports = _.partial(fs.readFileAsync.bind(fs), _, {encoding: 'utf8'});
