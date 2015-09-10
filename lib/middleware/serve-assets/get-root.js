'use strict';

var Bluebird      = require('../../promise/bluebird-mod');
var _             = require('lodash');
var swig          = require('swig');
var logError      = require('../../util/log').error;
var readFileAsync = require('../../fs-util/read-file-async');
var preProcessors = require('../../html').preProcessors;
var getOrThrow    = require('../../util/get-or-throw');
var Errors        = require('../../errors');

var UnsupportedProcessorError = Errors.UnsupportedProcessorError;

var readSource = _.modArgs(readFileAsync, function (ext) {
  return './html.' + ext;
});

var getPreProcessor           = _.partial(_.get, _, 'html.preprocessor', 'html');
var getPreProcessorDefination = _.partial(getOrThrow, preProcessors, _, UnsupportedProcessorError);
var getCssBase                = _.partial(_.get, _, 'css.base', null);
var getExternalStylesheets    = _.partial(_.get, _, 'css.external', null);
var getExternalScripts        = _.partial(_.get, _, 'js.external', null);
var renderPage                = _.curry(swig.render, 2);
var logErrorMsg               = _.flow(_.partial(_.get, _, 'message'), logError);

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
      cssBase: getCssBase(playground),
      stylesheets: getExternalStylesheets(playground),
      scripts: getExternalScripts(playground),
      fragment: fragment,
    }
  };
});

module.exports = function getRoot(req, res) {
  var playground = req.playground;

  Bluebird
    .try(getPreProcessor, [playground])
    .then(getPreProcessorDefination)
    .then(renderFragment)
    .then(buildRenderOptions(playground))
    .then(renderPage(req.template))
    .then(res.send.bind(res))
    .tapOnError(logErrorMsg)
    .catch(_.ary(_.partial(res.sendStatus.bind(res), 500), 0));
};
