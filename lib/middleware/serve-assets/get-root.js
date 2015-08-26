'use strict';

var Bluebird      = require('../../promise/bluebird-mod');
var _             = require('lodash');
var swig          = require('swig');
var error         = require('../../util/log').error;
var readFileAsync = require('../../util/read-file-async');
var preProcessors = require('../../html').preProcessors;
var getOrThrow    = require('../../util/get-or-throw');

var getPreProcessor            = Bluebird.method(_.partial(_.get, _, 'html.preprocessor', 'html'));
var NonSupportedProcessorError = _.modArgs(Error, function (name) {
  return '"' + name + '" is not a supported HTML preprocessor.';
});
var getPreProcessorDefination  = _.partial(getOrThrow, preProcessors, _, _.rearg(NonSupportedProcessorError, 1));
var getExternalStylesheets     = _.partial(_.get, _, 'css.external', null);
var getExternalScripts         = _.partial(_.get, _, 'js.external', null);
var readSource                 = _.modArgs(readFileAsync, function (ext) {
  return './html.' + ext;
});

function renderFragment(preProcessor) {
  return Bluebird
    .all(preProcessor.extensions)
    .tryInOrder(readSource)
    .then(preProcessor.render);
}

var buildRenderOptions = _.curry(function (playground, fragment) {
  return {
    locals: {
      title: playground.title,
      stylesheets: getExternalStylesheets(playground),
      scripts: getExternalScripts(playground),
      fragment: fragment,
    }
  };
});

module.exports = function getRoot(req, res) {
  var playground = req.playground;

  getPreProcessor(playground)
    .then(getPreProcessorDefination)
    .then(renderFragment)
    .then(buildRenderOptions(playground))
    .then(_.partial(swig.render, req.template))
    .then(res.send.bind(res))
    .catch(function (err) {
      error(err.message);
      res.sendStatus(500);
    });
};
