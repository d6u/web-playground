'use strict';

var express = require('express');
var defaults = require('lodash/object/defaults');
var bs = require('browser-sync').create();
var path = require('path');

var attachData = require('./middleware/attach-data');
var serveAssets = require('./middleware/serve-assets');

var DEFAULT_OPTS = {
  port: 3000,
};

exports.start = function start(opts) {
  var opts = defaults({}, opts, DEFAULT_OPTS);
  var app = express();
  app.use(attachData);
  app.use(serveAssets);
  app.listen(opts.port);

  bs.watch(path.resolve('{html,css,javascript}.*'))
    .on('change', bs.reload);

  bs.init({
    proxy: 'http://localhost:' + opts.port,
  });
};
