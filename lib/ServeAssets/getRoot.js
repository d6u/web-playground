'use strict';

var R = require('ramda');
var ejs = require('ejs');
var path = require('path');
var File = require('../util/file');
var readFile = File.readFile;

module.exports = function getRoot(req, res) {
  var playground = this.playground;
  console.log(playground);

  readFile(path.join(__dirname, '..', '..', 'template', 'index.ejs'))
    .subscribeOnNext(function (content) {
      res.send(content);
    });
};
