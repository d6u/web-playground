'use strict';

const co = require('co');
const getPlayground = require('./getPlayground');
const createAssetFileIfNotExist = require('./createAssetFilesIfNotExist');

module.exports = co.wrap(function *(opts) {
  const results = yield getPlayground(opts);
  const playground = results[0];
  let hasCreatedFromTmpl = results[1];
  if (yield createAssetFileIfNotExist(opts, playground)) {
    hasCreatedFromTmpl = true;
  }
  return hasCreatedFromTmpl;
});
