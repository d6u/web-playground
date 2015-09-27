'use strict';

var assert = require('assert');
var YAML = require('js-yaml');
var R = require('ramda');
var assets = require('../assets');
var Functional = require('./functional');
var File = require('./file');
var Observables = require('./Observables');
var Log = require('./log');

var logCreateFile = Functional.later(Log.logCreateFile);

function getExt(name) {
  return /^.+\.(\w+?)$/i.exec(name)[1].toLowerCase();
}

function parse(ext, content) {
  switch (ext) {
  case 'yml':
  case 'yaml':
    return YAML.safeLoad(content);
  case 'json':
    return JSON.parse(content);
  default:
    assert(false, ext + ' is not a recognizable playground format');
  }
}

function createAssetFile(playground, name, tmplFactory) {
  return R.pipe(
    R.path([name, 'preprocessor']),
    R.defaultTo(name),
    R.prop(R.__, assets[name].preProcessors),
    R.prop('extensions'),
    function (extensions) {
      return Observables.tryInOrder(extensions, R.pipe(R.concat(name + '.'), File.readFileObs))
        .catch(function (err) {
          if (!(err instanceof Observables.NoMoreFallbacksError)) throw err;
          var fileName = name + '.' + extensions[0];
          Log.info('Did not find ' + fileName + ', creating one...');
          return tmplFactory(extensions[0])
            .flatMap(File.writeFile(fileName))
            .doOnNext(logCreateFile(fileName));
        });
    }
  )(playground);
}

function parsePlaygroundFile(file) {
  return File.readFile(file)
    .then(function (content) {
      return parse(getExt(file), content);
    });
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
    R.prop(R.__, assets[type].preProcessors),
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
    R.prop(R.__, assets[type].preProcessors),
    R.prop('render')
  );
}

module.exports = {
  getExt: getExt,
  parse: parse,
  createAssetFile: createAssetFile,
  parsePlaygroundFile: parsePlaygroundFile,
  extensionsForAsset: extensionsForAsset,
  rendererForAsset: rendererForAsset,
};
