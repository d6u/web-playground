'use strict';

const assert = require('assert');
const Bluebird = require('bluebird');
const chalk = require('chalk');
const Observable = require('rx').Observable;
const R = require('ramda');
const Assets = require('./util/Assets');
const Functional = require('./util/Functional');
const Log = require('../lib/util/Log');
const File = require('./util/File');
const Playground = require('./util/Playground');
const Observables = require('./util/Observables');
const CONST = require('../lib/CONST');

const logCreateFile = Functional.later(Log.logCreateFile);

module.exports = (start) => {
  assert(typeof start === 'function', 'Must provide a function for preStart');

  let hasCreatedFromTmpl = false;

  Observables
    .tryInOrderCurry(
      R.converge(Bluebird.join, R.identity, File.readFile),
      CONST.PLAYGROUND_FILES)
    .catch(function (err) {
      Log.info('Did not find playground file, creating one...');
      hasCreatedFromTmpl = true;
      const content = File.readFile(CONST.PLAYGROUND_EXAMPLE)
        .tap(File.writeFile(CONST.DEFAULT_PLAYGROUND_FILE))
        .tap(logCreateFile(CONST.DEFAULT_PLAYGROUND_FILE));
      return Bluebird.join(CONST.DEFAULT_PLAYGROUND_FILE, content);
    })
    .map(R.adjust(Playground.getExt, 0))
    .map(R.apply(Playground.parse))
    .flatMap(R.converge(
      Observable.combineLatest,
      Assets.createAssetFileIfNotExist('html', (ext) => {
        hasCreatedFromTmpl = true;
        return ext === 'html' ? File.readFile(CONST.HTML_EXAMPLE) : '';
      }),
      Assets.createAssetFileIfNotExist('js', (ext) => {
        hasCreatedFromTmpl = true;
        return '';
      }),
      Assets.createAssetFileIfNotExist('css', (ext) => {
        hasCreatedFromTmpl = true;
        return '';
      })
    ))
    .subscribeOnCompleted(() => {
      if (hasCreatedFromTmpl) {
        Log.info(`Run ${chalk.green('wpg')} again to start live-reload server`);
        return;
      }
      start();
    });
};
