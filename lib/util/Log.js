/*eslint no-console:0*/

'use strict';

const chalk = require('chalk');
const R = require('ramda');

const LABEL_PLAYGROUND = `[${chalk.blue('playground')}]`;
const LABEL_ERROR = `[${chalk.red('Error')}]`;

const info = R.pipe(R.concat(`${LABEL_PLAYGROUND} `), console.log);
const error = R.pipe(R.concat(`${LABEL_ERROR} `), console.error);
const logCreateFile = R.pipe(chalk.green, R.concat('Created '), info);

module.exports = {
  info,
  error,
  logCreateFile
};
