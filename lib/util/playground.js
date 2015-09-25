'use strict';

var assert               = require('assert');
var yaml                 = require('js-yaml');
var R                    = require('ramda');
var __                   = R.__;
var pipe                 = R.pipe;
var defaultTo            = R.defaultTo;
var prop                 = R.prop;
var assetTypeMap         = require('../asset-type-map');
var Functional           = require('./functional');
var later                = Functional.later;
var noop                 = Functional.noop;
var File                 = require('./file');
var readFile             = File.readFile;
var writeFile            = File.writeFile;
var Observables          = require('./observables');
var tryInOrder           = Observables.tryInOrder;
var NoMoreFallbacksError = Observables.NoMoreFallbacksError;
var Log                  = require('./log');
var info                 = Log.info;
var logCreateFile        = later(Log.logCreateFile);

function getExt(name) {
  return /^.+\.(\w+?)$/i.exec(name)[1].toLowerCase();
}

function parse(ext, content) {
  switch (ext) {
  case 'yml':
  case 'yaml':
    return yaml.safeLoad(content);
  case 'json':
    return JSON.parse(content);
  default:
    assert(false, ext + ' is not a recognizable playground format');
  }
}

function createAssetFile(playground, name, tmplFactory) {
  return pipe(
    R.path([name, 'preprocessor']),
    defaultTo(name),
    prop(__, assetTypeMap[name].preProcessors),
    prop('extensions'),
    function (extensions) {
      return tryInOrder(extensions, pipe(R.concat(name + '.'), readFile))
        .catch(function (err) {
          var fileName = name + '.' + extensions[0];
          if (!(err instanceof NoMoreFallbacksError)) throw err;
          info('Did not find ' + fileName + ', creating one...');
          return tmplFactory(extensions[0])
            .flatMap(writeFile(fileName))
            .doOnNext(logCreateFile(fileName));
        });
    }
  )(playground);
}

module.exports = {
  getExt: getExt,
  parse: parse,
  createAssetFile: createAssetFile,
};
