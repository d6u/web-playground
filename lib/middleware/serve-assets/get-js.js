'use strict';

var curryRight = require('lodash/function/curryRight');
var curry = require('lodash/function/curry');
var get = require('lodash/object/get');
var mime = require('mime');
var jsProcessor = require('../../js');
var readFileAsync = require('../../util/read-file-async');
var error = require('../../util/log').error;

var getPreprocessor = curryRight(get, 3)('js.preprocessor', 'js');

module.exports = function getJs(req, res) {
  var playground = req.playground;

  var preprocessor = getPreprocessor(playground);

  var render = curry(jsProcessor.render)({preprocessor: preprocessor});

  var send = res.send.bind(res);

  res.set('Content-Type', mime.lookup('.js'));

  readFileAsync('./javascript.js')
    .then(render)
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        error('javascript.js file not found');
        res.sendStatus(404);
      }
    })
    .done(send);
};
