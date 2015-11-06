'use strict';

const assert = require('assert');
const YAML = require('js-yaml');
const R = require('ramda');
const path = require('path');

const getExt = R.pipe(
  path.extname,
  R.ifElse(
    R.either(R.equals(''), R.equals('.')),
    R.always(null),
    R.pipe(R.toLower, R.tail)
  )
);

const parse = (ext, content) => {
  switch (ext) {
  case 'yml':
  case 'yaml':
    return YAML.safeLoad(content);
  case 'json':
    return JSON.parse(content);
  default:
    assert(false, ext + ' is not a recognizable playground format');
  }
};

module.exports = {
  getExt,
  parse,
};
