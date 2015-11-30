'use strict';

const co = require('co');
const PathUtil = require('../../util/PathUtil');
const R = require('ramda');
const Assets = require('../../util/Assets');
const PromiseUtil = require('../../util/PromiseUtil');
const File = require('../../util/File');
const Helpers = require('./Helpers');

const loadHtml = co.wrap(function *(opts, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  const generateHtmlFilePaths = R.map(R.compose(getFullPath, R.concat('html.')));
  const htmlFiles = generateHtmlFilePaths(Assets.extensionsForAsset('html', playground));
  const html = yield PromiseUtil.tryInOrder(File.readFile, htmlFiles);
  return yield Assets.rendererForAsset('html', playground)(html);
});

const loadJs = co.wrap(function *(opts, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  const generateJsFilePaths = R.map(R.compose(getFullPath, R.concat('js.')));
  const jsFiles = generateJsFilePaths(Assets.extensionsForAsset('js', playground));
  const js = yield PromiseUtil.tryInOrder(File.readFile, jsFiles);
  return yield Assets.rendererForAsset('js', playground)(js);
});

const loadCss = co.wrap(function *(opts, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  const generateCssFilePaths = R.map(R.compose(getFullPath, R.concat('css.')));
  const cssFiles = generateCssFilePaths(Assets.extensionsForAsset('css', playground));
  const css = yield PromiseUtil.tryInOrder(File.readFile, cssFiles);
  const preProcessedCss = yield Assets.rendererForAsset('css', playground)(css);
  return yield Assets.postProcessorForCss(playground)(preProcessedCss);
});

module.exports = co.wrap(function *(opts, playground) {
  return yield {
    title: R.prop('title', playground),
    cssBaseContent: R.compose(Helpers.getCssBaseContent, R.path(['css', 'base']))(playground),
    stylesheets: R.path(['css', 'external'], playground),
    scripts: R.path(['js', 'external'], playground),
    html: loadHtml(opts, playground),
    js: loadJs(opts, playground),
    css: loadCss(opts, playground),
  };
});
