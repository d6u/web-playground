'use strict';

const assert = require('assert');
const Bluebird = require('bluebird');
const express = require('express');
const Observable = require('rx').Observable;
const R = require('ramda');
const Assets = require('./util/Assets');
const File = require('./util/File');
const Playground = require('./util/Playground');
const ServeAssets = require('./ServeAssets').ServeAssets;

const CONST = require('../lib/CONST');

function assertCssBase(base) {
  assert(
    R.contains(base, ['reset', 'normalize', null]),
    'css.base can only be "reset" or "normalize"');
}

const getBaseCss = R.pipe(R.path(['css', 'base']), R.defaultTo(null), R.tap(assertCssBase));
const getExternalCss = R.pipe(R.path(['css', 'external']), R.defaultTo([]));
const getExternalJs = R.pipe(R.path(['js', 'external']), R.defaultTo([]));

module.exports = (_opts) => {
  const opts = R.merge({}, CONST.WPG_DEFAULT_OPTS, _opts);

  const serveAssets = new ServeAssets();

  const app = express();
  app.use(serveAssets.router);
  app.listen(opts.port);

  const bs = require('browser-sync').create();
  bs.init({
    proxy: `http://localhost:${opts.port}`
  });

  const getHtmlExts = Assets.extensionsForAsset('html');
  const getHtmlRenderer = Assets.rendererForAsset('html');

  const getJsExts = Assets.extensionsForAsset('js');
  const getJsRenderer = Assets.rendererForAsset('js');

  const getCssExts = Assets.extensionsForAsset('css');
  const getCssRenderer = Assets.rendererForAsset('css');

  File.watch('playground.*')
    .flatMap(R.converge(Bluebird.join, R.identity, File.readFile))
    .map(R.adjust(Playground.getExt, 0))
    .map(R.apply(Playground.parse))
    .doOnNext(function (playground) {
      serveAssets.locals = {
        title: playground.title,
        cssBase: getBaseCss(playground),
        stylesheets: getExternalCss(playground),
        scripts: getExternalJs(playground),
      };
    })
    .map(function (playground) {
      let htmlSrc = File.watch('html.{' + getHtmlExts(playground).join(',') + '}')
        .flatMap(File.readFile)
        .flatMap(getHtmlRenderer(playground))
        .doOnNext(serveAssets.updateAsset('html').bind(serveAssets));

      let jsSrc = File.watch('js.{' + getJsExts(playground).join(',') + '}')
        .flatMap(File.readFile)
        .flatMap(getJsRenderer(playground))
        .doOnNext(serveAssets.updateAsset('js').bind(serveAssets));

      let cssSrc = File.watch('css.{' + getCssExts(playground).join(',') + '}')
        .flatMap(File.readFile)
        .flatMap(getCssRenderer(playground))
        .flatMap(Assets.postProcessorForCss(playground))
        .doOnNext(serveAssets.updateAsset('css').bind(serveAssets));

      return Observable.combineLatest(htmlSrc, jsSrc, cssSrc);
    })
    .switch()
    .subscribeOnNext(bs.reload.bind(bs));
};
