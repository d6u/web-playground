'use strict';

var Observable = require('rx').Observable;
var combineLatest = Observable.combineLatest;
var R = require('ramda');
var pipe = R.pipe;
var of = R.of;
var append = R.append;
var merge = R.merge;
var File = require('./util/file');
var readFile = File.readFile;
var watch = File.watch;
var Playground = require('./util/playground');
var parse = Playground.parse;
var getExt = Playground.getExt;
var parsePlaygroundFile = Playground.parsePlaygroundFile;
var createAssetFile = Playground.createAssetFile;
var extensionsForAsset = Playground.extensionsForAsset;
var rendererForAsset = Playground.rendererForAsset;
var Observables = require('./util/observables');

var CONSTANT = require('../lib/CONSTANT');
var DEFAULT_OPTS = CONSTANT.DEFAULT_OPTS;

module.exports = function start(_opts) {
  var opts = merge({}, DEFAULT_OPTS, _opts);
  var getHtmlExts = extensionsForAsset('html');
  var getHtmlRenderer = rendererForAsset('html');
  var getJsExts = extensionsForAsset('js');
  var getCssExts = extensionsForAsset('css');

  watch('playground.*')
    .flatMap(parsePlaygroundFile)
    .map(function (playground) {
      var html = watch('html.{' + getHtmlExts(playground).join(',') + '}')
        .flatMap(readFile)
        .flatMap(getHtmlRenderer(playground))

      // var js = watch('js.{' + getJsExts(playground).join(',') + '}');
      // var css = watch('css.{' + getCssExts(playground).join(',') + '}');
      // return combineLatest(html, js, css);
      return combineLatest(html);
    })
    .switch()
    .subscribeOnNext(console.log);


  // var app = express();
  // // app.use(attachData);
  // // app.use(serveAssets);
  // app.listen(opts.port);

  // var bs = require('browser-sync').create();
  // bs.watch().on('change', bs.reload);
  // bs.init({ proxy: 'http://localhost:' + opts.port });
};
