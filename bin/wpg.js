#!/usr/bin/env node

'use strict';

var program = require('commander');
var packageData = require('../package.json');

program
  .version(packageData.version)
  .description(packageData.description)
  .parse(process.argv);

// Defer requires for better performance on outputing helps

var Bluebird      = require('../lib/promise/bluebird-mod');
var path          = require('path');
var chalk         = require('chalk');
var _             = require('lodash');
var Log           = require('../lib/util/log');
var readFileAsync = require('../lib/fs-util/read-file-async');
var copy          = require('../lib/fs-util/copy');
var creatEmpty    = require('../lib/fs-util/create-empty');

var info = Log.info;

function logFileCreation(file) {
  var log = _.flow(chalk.green, function (str) { return 'Created ' + str; }, info);
  return _.ary(_.partial(log, file), 0);
}

Bluebird
  .resolve(['playground.yml', 'playground.json'])
  .tryInOrder(readFileAsync)
  .then(function () {
    require('../index').start();
  })
  .catch(function (err) {
    info('Did not find playground file, scaffold files for you.');

    var p1 = copy(path.join(__dirname, '..', 'template', 'playground.yml'), 'playground.yml')
      .tap(logFileCreation('playground.yml'));

    var p2 = copy(path.join(__dirname, '..', 'template', 'html.html'), 'html.html')
      .tap(logFileCreation('html.html'));

    var p3 = creatEmpty('css.css').tap(logFileCreation('css.css'));
    var p4 = creatEmpty('javascript.js').tap(logFileCreation('javascript.js'));

    Bluebird
      .join(p1, p2, p3, p4)
      .done(_.partial(info, 'Run ' + chalk.green('wpg') + ' to start live-reload server'));
  });
