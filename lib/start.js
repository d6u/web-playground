'use strict';

var express = require('express');
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
var ServeAssets = require('./ServeAssets').ServeAssets;

var CONSTANT = require('../lib/CONSTANT');
var DEFAULT_OPTS = CONSTANT.DEFAULT_OPTS;

module.exports = function start(_opts) {
  var opts = merge({}, DEFAULT_OPTS, _opts);

  var serveAssets = new ServeAssets();

  var app = express();
  app.use(serveAssets.router);
  app.listen(opts.port);

  var bs = require('browser-sync').create();
  bs.init({
    proxy: 'http://localhost:' + opts.port
  });

  var getHtmlExts = extensionsForAsset('html');
  var getHtmlRenderer = rendererForAsset('html');
  var getJsExts = extensionsForAsset('js');
  var getCssExts = extensionsForAsset('css');

  watch('playground.*')
    .flatMap(parsePlaygroundFile)
    .combineLatest()
    .map(function (playground) {
      serveAssets.playground = playground;

      var htmlSrc = watch('html.{' + getHtmlExts(playground).join(',') + '}')
        .flatMap(readFile)
        .flatMap(getHtmlRenderer(playground))
        .doOnNext(function (html) {
          serveAssets.updateAsset('html', html);
        })
        .doOnError(function (err) {
          serveAssets.updateAsset('html', err);
        });

      // var js = watch('js.{' + getJsExts(playground).join(',') + '}');
      // var css = watch('css.{' + getCssExts(playground).join(',') + '}');
      // return combineLatest(html, js, css);
      return combineLatest(htmlSrc);
    })
    .switch()
    .subscribeOnNext(bs.reload.bind(bs));
};
