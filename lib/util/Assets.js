'use strict';

const assetDefinitions = require('../asset-definitions');
const co = require('co');
const R = require('ramda');
const PathUtil = require('./PathUtil');
const File = require('./File');
const PromiseUtil = require('./PromiseUtil');
const Log = require('./Log');

function extensionsForAsset(type, playground) {
  const getExtensions = R.pipe(
    R.path([type, 'preprocessor']),
    R.defaultTo(type),
    R.prop(R.__, assetDefinitions[type].preProcessors),
    R.prop('extensions')
  );

  return getExtensions(playground);
}

const createAssetFileIfNotExist = co.wrap(function *(opts, playground, type, getTmpl) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  const extensions = extensionsForAsset(type, playground);
  const tryReadFile = R.pipe(R.concat(`${type}.`), getFullPath, File.readFile);

  try {
    yield PromiseUtil.tryInOrder(tryReadFile, extensions);
    return false;
  } catch (err) {
    const filePath = getFullPath(`${type}.${extensions[0]}`);
    Log.info(`Did not find ${filePath}, creating one...`);
    const fileContent = yield getTmpl(extensions[0]);
    yield File.writeFile(filePath, fileContent);
    Log.logCreateFile(filePath);
    return true;
  }
});

const createHtmlFileIfNotExist = co.wrap(function *(opts, playground) {
  return yield createAssetFileIfNotExist(opts, playground, 'html', co.wrap(function (ext) {
    return '<h1>Hello</h1>';
  }));
});

const createJsFileIfNotExist = co.wrap(function *(opts, playground) {
  return yield createAssetFileIfNotExist(opts, playground, 'js', co.wrap(function (ext) {
    return 'console.log(\'Hello\')';
  }));
});

const createCssFileIfNotExist = co.wrap(function *(opts, playground) {
  return yield createAssetFileIfNotExist(opts, playground, 'css', co.wrap(function (ext) {
    return 'body { color: red; }';
  }));
});

module.exports = {
  createHtmlFileIfNotExist,
  createJsFileIfNotExist,
  createCssFileIfNotExist,
};
