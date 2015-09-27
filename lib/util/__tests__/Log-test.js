'use strict';

jest.autoMockOff();

var sinon = require('sinon');
var R = require('ramda');
var chalk = require('chalk');

describe('Log', function () {

  var sandbox = sinon.sandbox.create();

  beforeEach(function () {
    sandbox.stub(console, 'log', R.identity);
    sandbox.stub(console, 'error', R.identity);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('info', function () {
    it('adds playground label in front', function () {
      var info = require('../Log').info;
      expect(info('message')).toBe('[' + chalk.blue('playground') + '] message');
    });
  });

  describe('error', function () {
    it('adds error label in front', function () {
      var error = require('../Log').error;
      expect(error('err message')).toBe('[' + chalk.red('Error') + '] err message');
    });
  });

  describe('logCreateFile', function () {
    it('log file name', function () {
      var logCreateFile = require('../Log').logCreateFile;
      expect(logCreateFile('js.js'))
        .toBe('[' + chalk.blue('playground') + '] Created ' + chalk.green('js.js'));
    });
  });

});
