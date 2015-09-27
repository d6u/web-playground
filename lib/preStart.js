'use strict';

var assert = require('assert');
var chalk = require('chalk');
var Observable = require('rx').Observable;
var R = require('ramda');
var Functional = require('./util/Functional');
var Log = require('../lib/util/Log');
var File = require('./util/File');
var Playground = require('./util/Playground');
var Observables = require('./util/Observables');
var CONST = require('../lib/CONST');

var logCreateFile = Functional.later(Log.logCreateFile);

module.exports = function preStart(start) {
  assert(typeof start === 'function', 'Must provide a function for preStart');

  var hasCreatedFromTmpl = false;

  Observables
    .tryInOrder(CONST.PLAYGROUND_FILES, File.readFileObs)
    .catch(function (err) {
      if (!(err instanceof Observables.NoMoreFallbacksError)) throw err;
      Log.info('Did not find playground file, creating one...');
      hasCreatedFromTmpl = true;
      return File.readFileObs(CONST.PLAYGROUND_EXAMPLE)
        .flatMap(function (content) { // -> Promise
          return File.writeFile(CONST.DEFAULT_PLAYGROUND_FILE, content)
            .tap(logCreateFile(CONST.DEFAULT_PLAYGROUND_FILE))
            .return(content);
        })
        .map(R.pipe(R.of, R.append(CONST.DEFAULT_PLAYGROUND_FILE)));
    })
    .map(function (results) {
      var content = results[0];
      var name = results[1];
      return Playground.parse(Playground.getExt(name), content);
    })
    .flatMap(function (playground) {
      var htmlObs = Playground.createAssetFile(playground, 'html', function (ext) {
        hasCreatedFromTmpl = true;
        return ext === 'html' ? File.readFileObs(CONST.HTML_EXAMPLE) : Observable.just('');
      });

      var jsObs = Playground.createAssetFile(playground, 'js', function (ext) {
        hasCreatedFromTmpl = true;
        return Observable.just('');
      });

      var cssObs = Playground.createAssetFile(playground, 'css', function (ext) {
        hasCreatedFromTmpl = true;
        return Observable.just('');
      });

      return Observable.combineLatest(htmlObs, jsObs, cssObs);
    })
    .subscribeOnCompleted(function () {
      if (hasCreatedFromTmpl) {
        Log.info('Run ' + chalk.green('wpg') + ' again to start live-reload server');
        return;
      }
      start();
    });
};
