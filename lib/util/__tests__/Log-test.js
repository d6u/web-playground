/*eslint no-console:0*/

'use strict';

jest.autoMockOff();

var chalk = require('chalk');

describe('Log', function () {

  beforeEach(function () {
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  describe('info', function () {
    it('adds playground label in front', function () {
      var info = require('../Log').info;
      info('message');
      expect(console.log).toHaveBeenCalledWith(
        '[' + chalk.blue('playground') + '] message');
    });
  });

  describe('error', function () {
    it('adds error label in front', function () {
      var error = require('../Log').error;
      error('err message');
      expect(console.error).toHaveBeenCalledWith(
        '[' + chalk.red('Error') + '] err message');
    });
  });

  describe('logCreateFile', function () {
    it('log file name', function () {
      var logCreateFile = require('../Log').logCreateFile;
      logCreateFile('js.js');
      expect(console.log).toHaveBeenCalledWith(
        '[' + chalk.blue('playground') + '] Created ' + chalk.green('js.js'));
    });
  });

});
