'use strict';

const chokidar = require('chokidar');
const R = require('ramda');
const Bluebird = require('bluebird');
const promisify = Bluebird.promisify;
const fs = require('fs');
const Observable = require('rx').Observable;
const Observables = require('./Observables');

const FS_OPTS = {encoding: 'utf8'};

const readFile = R.curry(R.binary(promisify(fs.readFile)))(R.__, FS_OPTS);

const readFileObs = Observables.observablefyPromise(readFile);

const writeFile = R.curryN(3, promisify(fs.writeFile))(R.__, R.__, FS_OPTS);

const isExist = R.curry(R.binary(promisify(fs.access)))(R.__, fs.F_OK);

function watch(pattern) {
  return Observable.create(function (observer) {
    const watcher = chokidar.watch(pattern, {
      ignored: /[\/\\]\./, // Don't care dotfiles
      persistent: true,
    });

    watcher.on('all', function(event, path) {
      observer.onNext(path);
    });

    return function () {
      watcher.close();
    };
  });
}

module.exports = {
  readFile,
  readFileObs,
  writeFile,
  watch,
  isExist,
};
