'use strict';

var assert = require('assert');
var YAML = require('js-yaml');

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

module.exports = {
  getExt,
  parse,
};
