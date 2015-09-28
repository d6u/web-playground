'use strict';

var Bluebird = require('bluebird');
var resolve = Bluebird.promisify(require('resolve'));

function resolveModule(name) {
  return resolve(name, {basedir: process.cwd()})
    .catch(function () {
      return resolve(name, {basedir: __dirname});
    })
    .spread(function (path, pkg) {
      return require(path);
    });
}

module.exports = {
  resolveModule: resolveModule,
};
