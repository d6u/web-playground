'use strict';

var Bluebird      = require('bluebird');
var path          = require('path');
var mime          = require('mime');
var readFileAsync = require('../../fs-util/read-file-async');

var PATH_NORMALIZE_CSS = require.resolve('normalize.css');

module.exports = function getCssReset(req, res) {
  res.set('Content-Type', mime.lookup('.css'));

  Bluebird.try(path.join, [PATH_NORMALIZE_CSS])
    .then(readFileAsync)
    .then(res.send.bind(res));
};
