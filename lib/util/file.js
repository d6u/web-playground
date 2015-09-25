'use strict';

var chokidar = require('chokidar');
var R = require('ramda');
var __ = R.__;
var curryN = R.curryN;
var fs = require('fs');
var Observable = require('rx').Observable;
var fromNodeCallback = Observable.fromNodeCallback;
var create = Observable.create;

var readFile = curryN(2, fromNodeCallback(fs.readFile))(__, {encoding: 'utf8'});
var writeFile = curryN(3, fromNodeCallback(fs.writeFile))(__, __, {encoding: 'utf8'});

function watch(pattern) {
  return create(function (observer) {
    var watcher = chokidar.watch(pattern, {
      ignored: /[\/\\]\./, // Don't care dotfiles
      persistent: true,
    });

    watcher.on('all', function(event, path) {
      observer.onNext([event, path]);
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
