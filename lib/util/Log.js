/*eslint no-console:0*/

'use strict';

var chalk = require('chalk');
var R = require('ramda');

var LABEL_PLAYGROUND = '[' + chalk.blue('playground') + ']';
var LABEL_ERROR = '[' + chalk.red('Error') + ']';

var info = R.pipe(R.concat(LABEL_PLAYGROUND + ' '), console.log);
var error = R.pipe(R.concat(LABEL_ERROR + ' '), console.error);
var logCreateFile = R.pipe(chalk.green, R.concat('Created '), info);

module.exports = {
  info: info,
  error: error,
  logCreateFile: logCreateFile
};
