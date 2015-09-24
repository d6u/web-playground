'use strict';

var assert = require('assert');
var yaml   = require('js-yaml');

var R         = require('ramda');
var __        = R.__;
var pipe      = R.pipe;
var of        = R.of;
var prepend   = R.prepend;
var append    = R.append;
var always    = R.always;
var defaultTo = R.defaultTo;
var prop      = R.prop;
var head      = R.head;

var assetTypeMap = require('../asset-type-map');

var Functional = require('./functional');
var noop       = Functional.noop;

var File      = require('./file');
var readFile  = File.readFile;
var writeFile = File.writeFile;

var Observables          = require('./observables');
var tryInOrder           = Observables.tryInOrder;
var NoMoreFallbacksError = Observables.NoMoreFallbacksError;

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

function createAssetFile(source, name, templateSouceFactory) {
  source.map(pipe(R.path([name, 'preprocessor']), defaultTo(name)))
    .map(pipe(prop(__, assetTypeMap[name].preProcessors), prop('extensions')))
    .flatMap(function (extensions) {
      return tryInOrder(extensions, pipe(R.concat(name + '.'), readFile))
        .catch(function (err) {
          var fileName = name + '.' + extensions[0];
          if (!(err instanceof NoMoreFallbacksError)) throw err;
          info('Did not find ' + fileName + ', creating one...');
          return templateSouceFactory(extensions[0])
            .flatMap(writeFile(fileName))
            .doOnNext(logCreateFile(fileName));
        });
    })
    .subscribeOnNext(noop);
}

module.exports = {
  getExt: getExt,
  parse: parse,
  createAssetFile: createAssetFile,
};
