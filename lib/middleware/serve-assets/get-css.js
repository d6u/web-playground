'use strict';

var curryRight = require('lodash/function/curryRight');
var curry = require('lodash/function/curry');
var get = require('lodash/object/get');
var cssProcessor = require('../../css');
var readFileAsync = require('../../util/read-file-async');

var getPreprocessor = curryRight(get, 3)('css.preprocessor', 'css');
var getVenderPrefixing = curryRight(get, 3)('css.vender_prefixing', null);

module.exports = function getCss(req, res) {
  var playground = req.playground;

  var preprocessor = getPreprocessor(playground);
  var venderPrefixing = getVenderPrefixing(playground);

  var render = curry(cssProcessor.render)({
    preprocessor: preprocessor,
    venderPrefixing: venderPrefixing,
  });

  var send = res.send.bind(res);

  readFileAsync('./css.' + preprocessor)
    .then(render)
    .done(send);
};
