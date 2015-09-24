#!/usr/bin/env node

'use strict';

var program = require('commander');
var packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description(packageJson.description)
  .parse(process.argv);

require('../index')();

// var chalk         = require('chalk');
// var creatEmpty    = require('../lib/fs-util/create-empty');

// Bluebird
//   .resolve(['playground.yml', 'playground.json'])
//   .tryInOrder(readFileAsync)
//   .catch(function (err) {

//     var p2 = copy(path.join(__dirname, '..', 'template', 'html.html'), 'html.html')
//       .tap(logFileCreation('html.html'));

//     var p3 = creatEmpty('css.css').tap(logFileCreation('css.css'));
//     var p4 = creatEmpty('javascript.js').tap(logFileCreation('javascript.js'));

//     Bluebird
//       .join(p1, p2, p3, p4)
//       .done(_.partial(info, 'Run ' + chalk.green('wpg') + ' to start live-reload server'));
//   })
//   .then(function () {
//     require('../index').start();
//   });
