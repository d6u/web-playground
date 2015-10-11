'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const Observable = require('rx').Observable;
const ejs = require('ejs');
const Functional = require('./util/Functional');
const Assets = require('./util/Assets');
const Observables = require('./util/Observables');
const File = require('./util/File');
const Playground = require('./util/Playground');
const Log = require('./util/Log');
const RenderError = require('./ServeAssets').RenderError;
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
      () => File.readFile(CONST.HTML_BUNDLE_TMPL),
      R.pipe(R.prop('title'), Bluebird.resolve),
      R.pipe(R.path(['css', 'base']), (cssBase) => {
        switch (cssBase) {
        case 'reset':
          return File.readFile(CONST.CSS_RESET_PATH);
        case 'normalize':
          return File.readFile(CONST.CSS_NORMALIZE_PATH);
        default:
          return Bluebird.resolve(null);
        }
      }),
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
    .doOnNext(R.apply((tmpl, title, cssBase, stylesheets, scripts, html, js, css) => {
      if (html instanceof RenderError) {
        throw html;
      }

      if (js instanceof RenderError) {
        throw js;
      }

      if (css instanceof RenderError) {
        throw css;
      }
    }))
    .map(R.apply((tmpl, title, cssBaseContent, stylesheets, scripts, html, js, css) =>
      [tmpl, {title, cssBaseContent, stylesheets, scripts, html, js, css}]
    ))
    .map(R.adjust(Functional.defaultToProps(CONST.DEFAULT_PLAYGROUND_CONTENT), 1))
    .map(R.apply(ejs.render))
    .subscribeOnNext(R.pipe(
      R.tap(() => Log.logCreateFile('index.html')),
      File.writeFile('./index.html')
    ));
};
