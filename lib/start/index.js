'use strict';

const express = require('express');
const ServeAssets = require('../ServeAssets').ServeAssets;
const startWatching = require('./startWatching');

module.exports = function (opts) {
  const serveAssets = new ServeAssets();

  const app = express();
  app.use(serveAssets.router);
  app.listen(opts.port);

  // Defer require browser-sync to improve performance when it is not needed
  const bs = require('browser-sync').create();
  bs.init({
    proxy: `http://localhost:${opts.port}`,
    ui: false,
    notify: false,
    ghostMode: false,
    open: opts.openBrowser,
  });

  startWatching(opts, serveAssets, bs);
};
