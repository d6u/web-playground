'use strict';

var Bluebird          = require('bluebird');
var path              = require('path');
var _                 = require('lodash');

var loadPlayground    = require('../fs-util/load-playground');
var readFileAsync     = require('../fs-util/read-file-async');
var defaultPlayground = require('../default-playground');

module.exports = function attachData(req, res, next) {
  var p1 = loadPlayground();
  var p2 = readFileAsync(path.join(__dirname, '..', '..', 'template', 'index.swig'));

  Bluebird
    .join(p1, p2, function (playground, template) {
      req.playground = _.defaults({}, playground, defaultPlayground);
      req.template = template;
    })
    .asCallback(next);
};
