'use strict';

// var express     = require('express');

var Observable = require('rx').Observable;
var just       = Observable.just;

var later = require('./util/functional').later;

var assetTypeMap = require('./asset-type-map');

var Log           = require('../lib/util/log');
var info          = Log.info;
var logCreateFile = later(Log.logCreateFile);

var File      = require('./util/file');
var readFile  = File.readFile;
var writeFile = File.writeFile;

var Playground = require('./util/playground');
var parse      = Playground.parse;
var getExt     = Playground.getExt;

var Observables          = require('./util/observables');
var tryInOrder           = Observables.tryInOrder;
var NoMoreFallbacksError = Observables.NoMoreFallbacksError;

var R         = require('ramda');
var __        = R.__;
var pipe      = R.pipe;
var of        = R.of;
var prepend   = R.prepend;
var append    = R.append;
var always    = R.always;
var defaultTo = R.defaultTo;
var prop      = R.prop;
var head      = R.head;

var CONSTANT            = require('../lib/CONSTANT');
var PLAYGROUND_FILES    = CONSTANT.PLAYGROUND_FILES;
var DEFAULT_PLAYGROUND  = CONSTANT.DEFAULT_PLAYGROUND;
var TEMPLATE_PLAYGROUND = CONSTANT.TEMPLATE_PLAYGROUND;

// var attachData  = require('./middleware/attach-data');
// var serveAssets = require('./middleware/serve-assets');

// var DEFAULT_OPTS = {
//   port: 3000,
// };

// function start(opts) {
//   var _opts = _.defaults({}, opts, DEFAULT_OPTS);

//   var app = express();
//   app.use(attachData);
//   app.use(serveAssets);
//   app.listen(_opts.port);

//   var bs = require('browser-sync').create();
//   bs.watch('{playground,html,css,javascript}.*').on('change', bs.reload);
//   bs.init({ proxy: 'http://localhost:' + _opts.port });
// };

module.exports = function () {
  var pg = tryInOrder(PLAYGROUND_FILES, readFile)
    .catch(function (err) {
      if (!(err instanceof NoMoreFallbacksError)) throw err;
      info('Did not find playground file, creating one...');
      return readFile(TEMPLATE_PLAYGROUND)
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
    });

  pg.map(pipe(R.path(['html', 'preprocessor']), defaultTo('html')))
    .map(pipe(prop(__, assetTypeMap.html.preProcessors), prop('extensions')))
    .flatMap(function (extensions) {
      return tryInOrder(extensions, pipe(R.concat('html.'), readFile))
        .catch(function (err) {
          if (!(err instanceof NoMoreFallbacksError)) throw err;
          info('Did not find html.' + extensions[0] + ', creating one...');
          // return readFile(TEMPLATE_PLAYGROUND)
          //   .flatMap(function (content) {
          //     return writeFile(DEFAULT_PLAYGROUND, content)
          //       .doOnNext(logCreateFile(DEFAULT_PLAYGROUND))
          //       .flatMap(function () {
          //         return just(content);
          //       });
          //   })
          //   .map(pipe(of, append(DEFAULT_PLAYGROUND)));
        });
    })
    .subscribe(
      function (x) {
        console.log('Next: ', x);
      },
      function (err) {
        console.log('Error: %s', err.stack);
      },
      function () {
        console.log('Completed');
      }
    );
};
