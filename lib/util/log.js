'use strict';

var chalk = require('chalk');

exports.info = function info(str) {
  console.log('[' + chalk.blue('WP') + '] ' + str);
};

exports.error = function error(str) {
  console.log('[' + chalk.red('Error') + '] ' + str);
};
