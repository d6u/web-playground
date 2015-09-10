'use strict';

var Bluebird      = require('../promise/bluebird-mod');
var readFileAsync = require('./read-file-async');
var yaml          = require('js-yaml');

function parsePlayground(file) {
  var parser;

  switch (file) {
  case 'playground.yml':
    parser = yaml.safeLoad;
    break;
  case 'playground.json':
    parser = JSON.parse;
    break;
  default:
    // No default
  }

  return readFileAsync(file).then(parser);
}

module.exports = function loadPlayground() {
  return Bluebird
    .resolve(['playground.yml', 'playground.json'])
    .tryInOrder(parsePlayground);
};
