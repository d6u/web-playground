'use strict';

const assert = require('assert');
const YAML = require('js-yaml');

const getExt = (name) => /^.+\.(\w+?)$/i.exec(name)[1].toLowerCase();

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
}

module.exports = {
  getExt,
  parse,
};
