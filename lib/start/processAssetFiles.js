'use strict';

const Assets = require('../util/Assets');
const File = require('../util/File');
const PathUtil = require('../util/PathUtil');
const R = require('ramda');
const Rx = require('rx');

function processHtmlFile(opts, serveAssets, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  return File.watch(getFullPath(`html.{${Assets.extensionsForAsset('html', playground).join(',')}}`))
    .flatMap(File.readFile)
    .flatMap(Assets.rendererForAsset('html', playground))
    .doOnNext(serveAssets.updateAsset('html'));
}

function processJsFile(opts, serveAssets, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  return File.watch(getFullPath(`js.{${Assets.extensionsForAsset('js', playground).join(',')}}`))
    .flatMap(File.readFile)
    .flatMap(Assets.rendererForAsset('js', playground))
    .doOnNext(serveAssets.updateAsset('js'));
}

function processCssFile(opts, serveAssets, playground) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  return File.watch(getFullPath(`css.{${Assets.extensionsForAsset('css', playground).join(',')}}`))
    .flatMap(File.readFile)
    .flatMap(Assets.rendererForAsset('css', playground))
    .flatMap(Assets.postProcessorForCss(playground))
    .doOnNext(serveAssets.updateAsset('css'));
}

module.exports = R.curry(function (opts, serveAssets, playground) {
  return Rx.Observable.merge(
    processHtmlFile(opts, serveAssets, playground),
    processJsFile(opts, serveAssets, playground),
    processCssFile(opts, serveAssets, playground)
  );
});
