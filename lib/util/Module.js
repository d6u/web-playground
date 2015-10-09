'use strict';

const Bluebird = require('bluebird');
const resolve = Bluebird.promisify(require('resolve'));

const resolveModule = (name) =>
  resolve(name, {basedir: process.cwd()})
    .catch(() => resolve(name, {basedir: __dirname}))
    .spread((path, pkg) => require(path));

module.exports = {
  resolveModule,
};
