'use strict';

var _ = require('lodash');
var promisify = require('bluebird').promisify;
var readFile = require('fs').readFile;

module.exports = _.partial(promisify(readFile), _, {encoding: 'utf8'});
