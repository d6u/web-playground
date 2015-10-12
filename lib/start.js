'use strict';

const Bluebird = require('bluebird');
const express = require('express');
const Observable = require('rx').Observable;
const R = require('ramda');
const Functional = require('./util/Functional');
const Assets = require('./util/Assets');
const File = require('./util/File');
const Playground = require('./util/Playground');
const ServeAssets = require('./ServeAssets').ServeAssets;

const CONST = require('../lib/CONST');

module.exports = (opts) => {
  const serveAssets = new ServeAssets();

  const app = express();
  app.use(serveAssets.router);
  app.listen(opts.port);

  const bs = require('browser-sync').create();
  bs.init({
    proxy: `http://localhost:${opts.port}`,
    ui: false,
    notify: false,
    ghostMode: false,
    open: opts.openBrowser,
  });

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
      Functional.defaultToProps(CONST.DEFAULT_PLAYGROUND_CONTENT),
      serveAssets.setLocals
    ))
    .flatMapLatest(R.converge(
      Observable.combineLatest,
      (playground) => File.watch(`html.{${Assets.getHtmlExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(Assets.getHtmlRenderer(playground))
        .doOnNext(serveAssets.updateAsset('html')),
      (playground) => File.watch(`js.{${Assets.getJsExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(Assets.getJsRenderer(playground))
        .doOnNext(serveAssets.updateAsset('js')),
      (playground) => File.watch(`css.{${Assets.getCssExts(playground).join(',')}}`)
        .flatMap(File.readFile)
        .flatMap(Assets.getCssRenderer(playground))
        .flatMap(Assets.postProcessorForCss(playground))
        .doOnNext(serveAssets.updateAsset('css'))
    ))
    .subscribeOnNext(opts.liveReload ? bs.reload.bind(bs) : Functional.noop);
};
