'use strict';

var R                = require('ramda');
var __               = R.__;
var curryN           = R.curryN;
var fs               = require('fs');
var fromNodeCallback = require('rx').Observable.fromNodeCallback;

var readFile = curryN(2, fromNodeCallback(fs.readFile))(__, {encoding: 'utf8'});
var writeFile =
  curryN(3, fromNodeCallback(fs.writeFile))(__, __, {encoding: 'utf8'});

module.exports = {
  readFile: readFile,
  writeFile: writeFile,
};
