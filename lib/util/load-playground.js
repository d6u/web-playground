'use strict';

var Bluebird = require('bluebird');
var readFileAsync = require('./read-file-async');
var path = require('path');
var yaml = require('js-yaml');

// () -> Promise(Object, Error)
module.exports = function loadPlayground() {
  return readFileAsync('./playground.yml')
    .then(yaml.safeLoad)
    .catch(function () {
      return readFileAsync('./playground.json').then(JSON.parse);
    })
    .catch(function () {
      throw 'Cannot find playground.yml or playground.json';
    });
};
