'use strict';

var Bluebird = require('bluebird');
var path = require('path');
var defaults = require('lodash/object/defaults');
var loadPlayground = require('../util/load-playground');
var readFileAsync = require('../util/read-file-async');
var defaultPlayground = require('../default-playground');

module.exports = function attachData(req, res, next) {
  var p1 = loadPlayground();
  var p2 = readFileAsync(path.join(__dirname, '..', '..', 'template', 'index.swig'));

  Bluebird
    .join(p1, p2, function (playground, template) {
      req.playground = defaults({}, playground, defaultPlayground);
      req.template = template;
    })
    .asCallback(next);
};
