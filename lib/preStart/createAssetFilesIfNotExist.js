'use strict';

const Assets = require('../util/Assets');
const co = require('co');
const R = require('ramda');

const anyElementIsTrue = R.any(R.equals(true));

module.exports = co.wrap(function *(opts, playground) {
  const results = yield [
    Assets.createHtmlFileIfNotExist(opts, playground),
    Assets.createJsFileIfNotExist(opts, playground),
    Assets.createCssFileIfNotExist(opts, playground),
  ];
  return anyElementIsTrue(results);
});

  // yield [
  //   Assets.createAssetFileIfNotExist(opts.baseDir, 'html', co(function *(ext) {
  //     hasCreatedFromTmpl = true;
  //     return ext === 'html' ? yield File.readFile(CONST.HTML_EXAMPLE) : '';
  //   }), playground),
  //   Assets.createAssetFileIfNotExist(opts.baseDir, 'js', co(function () {
  //     hasCreatedFromTmpl = true;
  //     return '';
  //   }), playground),
  //   Assets.createAssetFileIfNotExist(opts.baseDir, 'css', co(function () {
  //     hasCreatedFromTmpl = true;
  //     return '';
  //   }), playground),
  // ];
