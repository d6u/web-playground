'use strict';

var chokidar = require('chokidar');
var R = require('ramda');
var fs = require('fs');
var promisify = require('bluebird').promisify;
var Observable = require('rx').Observable;

var FS_OPTS = {encoding: 'utf8'};

var readFile = R.curryN(2, promisify(fs.readFile))(R.__, FS_OPTS);
var writeFile = R.curryN(3, promisify(fs.writeFile))(R.__, R.__, FS_OPTS);

function watch(pattern) {
  return Observable.create(function (observer) {
    var watcher = chokidar.watch(pattern, {
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
  readFile: readFile,
  writeFile: writeFile,
  watch: watch,
};
