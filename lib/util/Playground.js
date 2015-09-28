'use strict';

var assert = require('assert');
var YAML = require('js-yaml');
var File = require('./file');

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

function parsePlaygroundFile(fileName) {
  return File.readFile(fileName)
    .then(function (content) {
      return parse(getExt(fileName), content);
    });
}

module.exports = {
  getExt: getExt,
  parse: parse,
  parsePlaygroundFile: parsePlaygroundFile,
};
