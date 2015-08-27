'use strict';

var Bluebird     = require('bluebird');
var _            = require('lodash');
var autoprefixer = require('autoprefixer-core');

var getCss = _.partial(_.get, _, 'css');

module.exports = Bluebird.method(_.flow(autoprefixer.process, getCss));
