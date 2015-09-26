'use strict';

var assert = require('assert');
var chalk = require('chalk');
var Observable = require('rx').Observable;
var just = Observable.just;
var combineLatest = Observable.combineLatest;
var R = require('ramda');
var pipe = R.pipe;
var of = R.of;
var append = R.append;
var Functional = require('./util/functional');
var later = Functional.later;
var Log = require('../lib/util/log');
var info = Log.info;
var logCreateFile = later(Log.logCreateFile);
var File = require('./util/file');
var readFile = File.readFile;
var writeFile = File.writeFile;
var Playground = require('./util/playground');
var parse = Playground.parse;
var getExt = Playground.getExt;
var createAssetFile = Playground.createAssetFile;
var Observables = require('./util/observables');
var tryInOrder = Observables.tryInOrder;
var NoMoreFallbacksError = Observables.NoMoreFallbacksError;
var CONSTANT = require('../lib/CONSTANT');
var PLAYGROUND_FILES = CONSTANT.PLAYGROUND_FILES;
var DEFAULT_PLAYGROUND = CONSTANT.DEFAULT_PLAYGROUND;
var TMPL_PLAYGROUND = CONSTANT.TMPL_PLAYGROUND;
var TMPL_HTML = CONSTANT.TMPL_HTML;

module.exports = function preStart(start) {
  assert(typeof start === 'function', 'Must provide a function for preStart');

  var hasCreatedFromTmpl = false;

  tryInOrder(PLAYGROUND_FILES, readFile)
    .catch(function (err) {
      if (!(err instanceof NoMoreFallbacksError)) throw err;
      info('Did not find playground file, creating one...');
      hasCreatedFromTmpl = true;
      return readFile(TMPL_PLAYGROUND)
        .flatMap(function (content) {
          return writeFile(DEFAULT_PLAYGROUND, content)
            .doOnNext(logCreateFile(DEFAULT_PLAYGROUND))
            .flatMap(function () {
              return just(content);
            });
        })
        .map(pipe(of, append(DEFAULT_PLAYGROUND)));
    })
    .map(function (results) {
      var content = results[0];
      var name = results[1];
      return parse(getExt(name), content);
    })
    .flatMap(function (playground) {
      var htmlObs = createAssetFile(playground, 'html', function (ext) {
        hasCreatedFromTmpl = true;
        return ext === 'html' ? readFile(TMPL_HTML) : just('');
      });

      var jsObs = createAssetFile(playground, 'js', function (ext) {
        hasCreatedFromTmpl = true;
        return just('');
      });

      var cssObs = createAssetFile(playground, 'css', function (ext) {
        hasCreatedFromTmpl = true;
        return just('');
      });

      return combineLatest(htmlObs, jsObs, cssObs);
    })
    .subscribeOnCompleted(function () {
      if (hasCreatedFromTmpl) {
        info('Run ' + chalk.green('wpg') + ' again to start live-reload server');
        return;
      }
      start();
    });
};
