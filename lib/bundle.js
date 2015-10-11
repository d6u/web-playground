'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const Observable = require('rx').Observable;
const Functional = require('./util/Functional');
const Assets = require('./util/Assets');
const Observables = require('./util/Observables');
const File = require('./util/File');
const Playground = require('./util/Playground');
const CONST = require('./CONST');

module.exports = () => {
  Observables
    .tryInOrderCurry(
      R.converge(Bluebird.join, R.identity, File.readFile),
      CONST.PLAYGROUND_FILES)
    .map(R.adjust(Playground.getExt, 0))
    .map(R.apply(Playground.parse))
    .flatMap(R.converge(
      Observable.combineLatest,
      R.pipe(R.prop('title'), Bluebird.resolve),
      R.pipe(R.path(['css', 'base']), Bluebird.resolve),
      R.pipe(R.path(['css', 'external']), Bluebird.resolve),
      R.pipe(R.path(['js', 'external']), Bluebird.resolve),
      (playground) => Observables
        .tryInOrderCurry(
          File.readFile,
          R.map(R.concat('html.'), Assets.getHtmlExts(playground)))
        .flatMap(Assets.getHtmlRenderer(playground)),
      (playground) => Observables
        .tryInOrderCurry(
          File.readFile,
          R.map(R.concat('js.'), Assets.getJsExts(playground)))
        .flatMap(Assets.getJsRenderer(playground)),
      (playground) => Observables
        .tryInOrderCurry(
          File.readFile,
          R.map(R.concat('css.'), Assets.getCssExts(playground)))
        .flatMap(Assets.getCssRenderer(playground))
        .flatMap(Assets.postProcessorForCss(playground))
    ))
    .map(R.apply((title, cssBase, stylesheets, scripts, html, js, css) =>
      ({title, cssBase, stylesheets, scripts, html, js, css})))
    .map(Functional.defaultToProps(CONST.DEFAULT_PLAYGROUND_CONTENT))
    .subscribeOnNext(console.log);
};
