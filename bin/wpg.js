#!/usr/bin/env node

var program = require('commander');
var package = require('../package.json');

program
  .version(package.version)
  .description('WebPlayground bootstraps simple HTML, JS, CSS files' +
    'and setup live-reloading server for you.')
  .parse(process.argv);

// Defer requires for better performance on outputing helps

var Bluebird = require('bluebird');
var path = require('path');
var fs = require('../lib/promisified/fs');
var Log = require('../lib/util/log');
var chalk = require('chalk');

var info = Log.info;

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

function deferLog(str) {
  return function () {
    info(str);
  };
}

function logFileCreation(file) {
  return deferLog('Created ' + file);
}

existsAsync(path.resolve('playground.yml'))
  .then(function (exists) {
    return exists ? true : existsAsync(path.resolve('playground.json'));
  })
  .done(function (exists) {
    if (exists) {
      require('../index').start();
      return;
    }

    info('Did not find playground file, scaffold files for you.');

    var p1 = copy(
      path.join(__dirname, '..', 'template', 'playground.yml'),
      path.resolve('playground.yml'))
      .tap(logFileCreation('playground.yml'));

    var p2 = copy(
      path.join(__dirname, '..', 'template', 'html.html'),
      path.resolve('html.html'))
      .tap(logFileCreation('html.html'));

    var p3 = creatEmpty(path.resolve('css.css'))
      .tap(logFileCreation('css.css'));

    var p4 = creatEmpty(path.resolve('javascript.js'))
      .tap(logFileCreation('javascript.js'));

    Bluebird
      .all([p1, p2, p3, p4])
      .done(deferLog('Run ' + chalk.green('wpg') + ' to start live-reload server'));
  });
