'use strict';

var express = require('express');
var attachData = require('./middleware/attach-data');
var serveAssets = require('./middleware/serve-assets');
var defaults = require('lodash/object/defaults');

var DEFAULT_OPTS = {
  port: 3000,
};

exports.start = function start(opts) {
  var opts = defaults({}, opts, DEFAULT_OPTS);
  var app = express();
  app.use(attachData);
  app.use(serveAssets);
  app.listen(opts.port);
};
