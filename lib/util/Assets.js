'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const assetDefinitions = require('../asset-definitions');
const Observables = require('./Observables');
const File = require('./File');
const Log = require('./Log');
const Functional = require('./Functional');

const logCreateFile = Functional.later(Log.logCreateFile);

/**
 * Get supported extensions for specified asset type
 *
 * @param  {string}   type Could be 'html', 'js' or 'css'
 * @return {function}      Accept playground object as argument, return array
 *                         of extension strings
 */
const extensionsForAsset = (type) => R.pipe(
  R.path([type, 'preprocessor']),
  R.defaultTo(type),
  R.prop(R.__, assetDefinitions[type].preProcessors),
  R.prop('extensions')
);

/**
 * Get render function for specified asset type
 *
 * @param  {string}   type Could be 'html', 'js' or 'css'
 * @return {function}      Accept playground object as argument, return render
 *                         function for the asset type specified in playground
 */
const rendererForAsset = (type) => R.pipe(
  R.path([type, 'preprocessor']),
  R.defaultTo(type),
  R.prop(R.__, assetDefinitions[type].preProcessors),
  R.prop('render')
);

/**
 * Get CSS post processor render function
 *
 * @param  {object}   playground Playground config object
 * @return {function}            Return post processor render function
 */
const postProcessorForCss = R.pipe(
  R.path(['css', 'vender_prefixing']),
  R.defaultTo('raw'),
  R.prop(R.__, assetDefinitions.css.postProcessors),
  R.prop('render')
);

const getHtmlExts = extensionsForAsset('html');
const getHtmlRenderer = rendererForAsset('html');

const getJsExts = extensionsForAsset('js');
const getJsRenderer = rendererForAsset('js');

const getCssExts = extensionsForAsset('css');
const getCssRenderer = rendererForAsset('css');

/**
 * Create html, css or js file according to the playground config and
 * assets defination
 *
 * @param  {string}   baseDir     Base directory to find assets
 * @param  {string}   type        "html", "css" or "js"
 * @param  {function} tmplFactory Return content of asset file, accept extension
 *                                as argument, can return string or promise that
 *                                resolve to string
 *
 * @return {function}             Accept playground config object as argument.
 *                                Return observable that emit after file is
 *                                written to disk.
 */
const createAssetFileIfNotExist = (baseDir, type, tmplFactory) => {
  const joinBase = File.join(baseDir);

  return R.pipe(
    extensionsForAsset(type),
    (extensions) => Observables
      .tryInOrderCurry(R.compose(File.readFile, joinBase, R.concat(`${type}.`)), extensions)
      .catch((err) => {
        const file = joinBase(`${type}.${extensions[0]}`);
        Log.info(`Did not find ${file}, creating one...`);
        return Bluebird.resolve(tmplFactory(extensions[0]))
          .tap(File.writeFile(file))
          .tap(logCreateFile(file));
      })
  );
};

module.exports = {
  extensionsForAsset,
  rendererForAsset,
  postProcessorForCss,
  getHtmlExts,
  getHtmlRenderer,
  getJsExts,
  getJsRenderer,
  getCssExts,
  getCssRenderer,
  createAssetFileIfNotExist,
};
