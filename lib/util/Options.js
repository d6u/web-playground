'use strict';

const R = require('ramda');
const co = require('co');
const path = require('path');
const Bluebird = require('bluebird');
const findAPortNotInUseAsync = Bluebird.promisify(require('portscanner').findAPortNotInUse);
const Functional = require('./Functional');

const WPG_DEFAULT_OPTS = {
  port: 3000,
  bundle: false,
  openBrowser: true,
  liveReload: true,
  baseDir: process.cwd(),
};

const mergeDefault = co.wrap(function *(opts) {
  const port = yield findAPortNotInUseAsync(3000, 65535, '127.0.0.1');
  const defaultOpts = Functional.defaultToProps(WPG_DEFAULT_OPTS, {port});

  if (opts.targetDir) {
    const optsWithAbsoluteBaseDir = R.assoc('baseDir', path.resolve(opts.targetDir), opts);
    return Functional.defaultToProps(defaultOpts, optsWithAbsoluteBaseDir);
  }

  return Functional.defaultToProps(defaultOpts, opts);
});

module.exports = {
  mergeDefault,
};
