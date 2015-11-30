'use strict';

const Bluebird = require('bluebird');
const chokidar = require('chokidar');
const fs = require('fs');
const Observable = require('rx').Observable;
const promisify = Bluebird.promisify;
const R = require('ramda');

const FS_OPTS = {encoding: 'utf8'};

const readFile = R.curry(R.binary(promisify(fs.readFile)))(R.__, FS_OPTS);

const writeFile = R.curry(R.nAry(3, promisify(fs.writeFile)))(R.__, R.__, FS_OPTS);

const watch = (pattern) => Observable.create((observer) => {
  const watcher = chokidar.watch(pattern, {
    ignored: /[\/\\]\./, // Don't care dotfiles
    persistent: true,
  });

  watcher.on('all', (event, file) => observer.onNext(file));

  return () => watcher.close();
});

module.exports = {
  readFile,
  writeFile,
  watch,
};
