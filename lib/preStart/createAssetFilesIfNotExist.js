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
