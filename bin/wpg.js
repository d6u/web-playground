#!/usr/bin/env node

var Bluebird = require('bluebird');
var program = require('commander');
var path = require('path');
var _ = require('lodash');
var package = require('../package.json');
var fs = require('../lib/promisified/fs');
var server = require('../index');

function existsAsync(file) {
  return Bluebird.fromNode(function (callback) {
    fs.exists(file, function (exists) {
      callback(null, exists);
    });
  });
}

function copy(fromFile, toFile) {
  return Bluebird.fromNode(function (callback) {
    fs.createReadStream(fromFile)
      .pipe(fs.createWriteStream(toFile))
      .on('finish', callback);
  });
}

function creatEmpty(dest) {
  return Bluebird.fromNode(function (callback) {
    var stream = fs.createWriteStream(dest);
    stream.on('finish', callback);
    stream.write('');
    stream.end();
  });
}

program
  .version(package.version)
  .parse(process.argv);

existsAsync(path.resolve('playground.yml'))
  .then(function (exists) {
    return exists ? true : existsAsync(path.resolve('playground.json'));
  })
  .then(function (exists) {
    if (exists) {
      return [];
    } else {
      var p1 = copy(
        path.join(__dirname, '..', 'template', 'playground.yml'),
        path.resolve('playground.yml'));
      var p2 = copy(
        path.join(__dirname, '..', 'template', 'html.html'),
        path.resolve('html.html'));
      var p3 = creatEmpty(path.resolve('css.css'));
      var p4 = creatEmpty(path.resolve('javascript.js'));

      return [p1, p2, p3, p4];
    }
  })
  .all()
  .done(server.start);
