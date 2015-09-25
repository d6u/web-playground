/*eslint no-console:0*/

'use strict';

var chalk = require('chalk');
var R = require('ramda');

function info(str) {
  console.log('[' + chalk.blue('playground') + '] ' + str);
}

function error(str) {
  console.log('[' + chalk.red('Error') + '] ' + str);
}

var logCreateFile = R.pipe(
  chalk.green,
  function (str) {
    return 'Created ' + str;
  },
  info);

module.exports = {
  info: info,
  error: error,
  logCreateFile: logCreateFile
};
