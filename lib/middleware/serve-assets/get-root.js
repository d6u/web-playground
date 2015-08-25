'use strict';

var swig = require('swig');
var curryRight = require('lodash/function/curryRight');
var curry = require('lodash/function/curry');
var get = require('lodash/object/get');
var htmlProcessor = require('../../html');
var readFileAsync = require('../../util/read-file-async');
var error = require('../../util/log').error;

var getPreprocessor = curryRight(get, 3)('html.preprocessor', 'html');
var getExternalStylesheets = curryRight(get, 3)('css.external', null);
var getExternalScripts = curryRight(get, 3)('js.external', null);

module.exports = function getRoot(req, res) {
  var playground = req.playground;

  var preprocessor = getPreprocessor(playground);

  var renderFragment = curry(htmlProcessor.render)({preprocessor: preprocessor});

  var buildOptions = curry(function (title, stylesheets, scripts, fragment) {
    return {
      locals: {
        title: title,
        fragment: fragment,
        stylesheets: stylesheets,
        scripts: scripts,
      }
    };
  })(
    playground.title,
    getExternalStylesheets(playground),
    getExternalScripts(playground));

  var renderIndex = curry(swig.render)(req.template);

  var send = res.send.bind(res);

  readFileAsync('./html.' + preprocessor)
    .then(renderFragment)
    .then(buildOptions)
    .then(renderIndex)
    .then(send)
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        error('html.' + preprocessor + ' file not found');
        res.sendStatus(404);
      }
    })
    .done();
};
