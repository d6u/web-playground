'use strict';

var Bluebird      = require('bluebird');
var path          = require('path');
var mime          = require('mime');
var readFileAsync = require('../../fs-util/read-file-async');

module.exports = function getCssReset(req, res) {
  res.set('Content-Type', mime.lookup('.css'));

  Bluebird.try(path.join, [__dirname, '..', '..', '..', 'static', 'reset.css'])
    .then(readFileAsync)
    .then(res.send.bind(res));
};
