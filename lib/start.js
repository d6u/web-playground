'use strict';

const Bluebird = require('bluebird');
const express = require('express');
const Observable = require('rx').Observable;
const R = require('ramda');
const Assets = require('./util/Assets');
const File = require('./util/File');
const Playground = require('./util/Playground');
const ServeAssets = require('./ServeAssets').ServeAssets;

const CONST = require('../lib/CONST');

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
    .doOnNext(R.pipe(
      R.converge(
        (title, cssBase, stylesheets, scripts) => ({title, cssBase, stylesheets, scripts}),
        R.prop('title'),
        R.path(['css', 'base']),
        R.path(['css', 'external']),
        R.path(['js', 'external'])
      ),
      (locals) => R.merge({}, CONST.DEFAULT_PLAYGROUND_CONTENT, locals),
      serveAssets.setLocals
    ))
    .flatMapLatest(R.converge(
      Observable.combineLatest,
      (playground) => File.watch(`html.{${getHtmlExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(getHtmlRenderer(playground))
        .doOnNext(serveAssets.updateAsset('html')),
      (playground) => File.watch(`js.{${getJsExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(getJsRenderer(playground))
        .doOnNext(serveAssets.updateAsset('js')),
      (playground) => File.watch(`css.{${getCssExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(getCssRenderer(playground))
        .flatMap(Assets.postProcessorForCss(playground))
        .doOnNext(serveAssets.updateAsset('css'))
    ))
    .subscribeOnNext(bs.reload.bind(bs));
};
