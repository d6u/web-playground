'use strict';

const path = require('path');
const Bluebird = require('bluebird');
const Observable = require('rx').Observable;
const R = require('ramda');
const Assets = require('./util/Assets');
const Functional = require('./util/Functional');
const Log = require('../lib/util/Log');
const File = require('./util/File');
const Playground = require('./util/Playground');
const Observables = require('./util/Observables');
const PromiseUtil = require('./util/PromiseUtil');
const CONST = require('../lib/CONST');

const logCreateFile = Functional.later(Log.logCreateFile);

module.exports = opts => PromiseUtil.fromObservable(() => {
  const joinBase = R.partial(path.join, opts.baseDir);
  let hasCreatedFromTmpl = false;

  return Observables
    .tryInOrderCurry(
      R.converge(Bluebird.join, R.identity, File.readFile),
      R.map(joinBase, CONST.PLAYGROUND_FILES))
    .catch(function (err) {
      Log.info('Did not find playground file, creating one...');
      hasCreatedFromTmpl = true;
      const defaultPlaygroundFile = joinBase(CONST.DEFAULT_PLAYGROUND_FILE);
      const content = File.readFile(CONST.PLAYGROUND_EXAMPLE)
        .tap(File.writeFile(defaultPlaygroundFile))
        .tap(logCreateFile(defaultPlaygroundFile));
      return Bluebird.join(defaultPlaygroundFile, content);
    })
    .map(R.adjust(Playground.getExt, 0))
    .map(R.apply(Playground.parse))
    .flatMap(R.converge(
      Observable.combineLatest,
      Assets.createAssetFileIfNotExist(opts.baseDir, 'html', ext => {
        hasCreatedFromTmpl = true;
        return ext === 'html' ? File.readFile(CONST.HTML_EXAMPLE) : '';
      }),
      Assets.createAssetFileIfNotExist(opts.baseDir, 'js', ext => {
        hasCreatedFromTmpl = true;
        return '';
      }),
      Assets.createAssetFileIfNotExist(opts.baseDir, 'css', ext => {
        hasCreatedFromTmpl = true;
        return '';
      })
    ))
    .map(() => hasCreatedFromTmpl);
});
