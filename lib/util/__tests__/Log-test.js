/*eslint no-console:0*/

'use strict';

jest.autoMockOff();

const chalk = require('chalk');

describe('Log', () => {

  beforeEach(() => {
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  describe('info', () => {
    it('adds playground label in front', () => {
      const info = require('../Log').info;
      info('message');
      expect(console.log).toHaveBeenCalledWith(
        '[' + chalk.blue('playground') + '] message');
    });
  });

  describe('error', () => {
    it('adds error label in front', () => {
      const error = require('../Log').error;
      error('err message');
      expect(console.error).toHaveBeenCalledWith(
        '[' + chalk.red('Error') + '] err message');
    });
  });

  describe('logCreateFile', () => {
    it('log file name', () => {
      const logCreateFile = require('../Log').logCreateFile;
      logCreateFile('js.js');
      expect(console.log).toHaveBeenCalledWith(
        '[' + chalk.blue('playground') + '] Created ' + chalk.green('js.js'));
    });
  });

});
