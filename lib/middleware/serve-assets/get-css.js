'use strict';

var curryRight = require('lodash/function/curryRight');
var curry = require('lodash/function/curry');
var get = require('lodash/object/get');
var mime = require('mime');
var cssProcessor = require('../../css');
var readFileAsync = require('../../util/read-file-async');
var error = require('../../util/log').error;

var getPreprocessor = curryRight(get, 3)('css.preprocessor', 'css');
var getVenderPrefixing = curryRight(get, 3)('css.vender_prefixing', 'raw');

module.exports = function getCss(req, res) {
  var playground = req.playground;

  var preprocessor = getPreprocessor(playground);
  var venderPrefixing = getVenderPrefixing(playground);

  var render = curry(cssProcessor.render)({
    preprocessor: preprocessor,
    venderPrefixing: venderPrefixing,
  });

  var send = res.send.bind(res);

  res.set('Content-Type', mime.lookup('.css'));

  readFileAsync('./css.' + preprocessor)
    .then(render)
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        error('css.' + preprocessor + ' file not found');
        res.sendStatus(404);
      }
    })
    .done(send);
};
