'use strict';

const Bluebird = require('bluebird');
const findAPortNotInUseAsync = Bluebird.promisify(require('portscanner').findAPortNotInUse);
const Functional = require('./Functional');

const WPG_DEFAULT_OPTS = {
  port: 3000,
  bundle: false,
  openBrowser: true,
  liveReload: true,
};

const mergeDefault = (opts) => findAPortNotInUseAsync(3000, 65535, '127.0.0.1')
  .then((port) => Functional.defaultToProps(WPG_DEFAULT_OPTS, {port}))
  .then((defaultOpts) => Functional.defaultToProps(defaultOpts, opts));

module.exports = {
  mergeDefault,
};
