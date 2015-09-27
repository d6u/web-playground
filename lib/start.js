'use strict';

var assert = require('assert');
var express = require('express');
var Observable = require('rx').Observable;
var combineLatest = Observable.combineLatest;
var R = require('ramda');
var merge = R.merge;
var File = require('./util/file');
var readFile = File.readFile;
var watch = File.watch;
var Playground = require('./util/playground');
var parsePlaygroundFile = Playground.parsePlaygroundFile;
var extensionsForAsset = Playground.extensionsForAsset;
var rendererForAsset = Playground.rendererForAsset;
var ServeAssets = require('./ServeAssets').ServeAssets;

var CONST = require('../lib/CONST');
var WPG_DEFAULT_OPTS = CONST.WPG_DEFAULT_OPTS;

function assertCssBase(base) {
  assert(['reset', 'normalize', null].indexOf(base) > -1, 'CSS base can only be "reset" or "normalize"');
}

var getBaseCss = R.pipe(R.path(['css', 'base']), R.defaultTo(null), R.tap(assertCssBase));
var getExternalCss = R.pipe(R.path(['css', 'external']), R.defaultTo([]));
var getExternalJs = R.pipe(R.path(['js', 'external']), R.defaultTo([]));

module.exports = function start(_opts) {
  var opts = merge({}, WPG_DEFAULT_OPTS, _opts);

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
    .map(function (playground) {
      serveAssets.playground = playground;
      serveAssets.locals = {
        title: playground.title,
        cssBase: getBaseCss(playground),
        stylesheets: getExternalCss(playground),
        scripts: getExternalJs(playground),
      };

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
