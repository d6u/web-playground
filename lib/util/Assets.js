'use strict';

var R = require('ramda');
var assetDefinitions = require('../asset-definitions');
var Observables = require('./Observables');
var File = require('./file');
var Log = require('./log');
var Functional = require('./functional');

var logCreateFile = Functional.later(Log.logCreateFile);

/**
 * Create html, css or js file according to the playground config and
 * assets defination
 *
 * @param  {string}   type        "html", "css" or "js"
 * @param  {function} tmplFactory Return content of asset file, accept extension
 *                                as argument
 * @return {function}             Accept playground config object as argument.
 *                                Return observable that emit after file is
 *                                written to disk.
 */
function createAssetFile(type, tmplFactory) {
  return R.pipe(
    R.path([type, 'preprocessor']),
    R.defaultTo(type),
    R.prop(R.__, assetDefinitions[type].preProcessors),
    R.prop('extensions'),
    function (extensions) {
      return Observables.tryInOrder(extensions, R.pipe(R.concat(type + '.'), File.readFileObs))
        .catch(function (err) {
          if (!(err instanceof Observables.NoMoreFallbacksError)) throw err;
          var fileName = type + '.' + extensions[0];
          Log.info('Did not find ' + fileName + ', creating one...');
          return tmplFactory(extensions[0])
            .flatMap(File.writeFile(fileName))
            .doOnNext(logCreateFile(fileName));
        });
    }
  );
}

/**
 * Get supported extensions for specified asset type
 *
 * @param  {string}   type Could be 'html', 'js' or 'css'
 * @return {function}      Accept playground object as argument, return array
 *                         of extension strings
 */
function extensionsForAsset(type) {
  return R.pipe(
    R.path([type, 'preprocessor']),
    R.defaultTo(type),
    R.prop(R.__, assetDefinitions[type].preProcessors),
    R.prop('extensions')
  );
}

/**
 * Get render function for specified asset type
 *
 * @param  {string}   type Could be 'html', 'js' or 'css'
 * @return {function}      Accept playground object as argument, return render
 *                         function for the asset type specified in playground
 */
function rendererForAsset(type) {
  return R.pipe(
    R.path([type, 'preprocessor']),
    R.defaultTo(type),
    R.prop(R.__, assetDefinitions[type].preProcessors),
    R.prop('render')
  );
}

module.exports = {
  createAssetFile: createAssetFile,
  extensionsForAsset: extensionsForAsset,
  rendererForAsset: rendererForAsset,
};
