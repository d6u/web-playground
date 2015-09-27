'use strict';

var Bluebird       = require('../../promise/bluebird-mod');
var _              = require('lodash');
var mime           = require('mime');
var logError       = require('../../util/log').error;
var readFileAsync  = require('../../fs-util/read-file-async');
var getOrThrow     = require('../../util/get-or-throw');
var Errors         = require('../../errors');
var CSS            = require('../../css');
var preProcessors  = CSS.preProcessors;
var postProcessors = CSS.postProcessors;

var UnsupportedProcessorError = Errors.UnsupportedProcessorError;

var readSource = _.modArgs(readFileAsync, function (ext) {
  return './css.' + ext;
});

var getPreProcessor            = _.partial(_.get, _, 'css.preprocessor', 'css');
var getPostProcessor           = _.partial(_.get, _, 'css.vender_prefixing', 'raw');
var getPreProcessorDefination  = _.partial(getOrThrow, preProcessors, _, UnsupportedProcessorError);
var getPostProcessorDefination = _.partial(getOrThrow, postProcessors, _, UnsupportedProcessorError);
var logErrorMsg                = _.flow(_.partial(_.get, _, 'message'), logError);

function renderResource(preProcessor, postProcessor) {
  return Bluebird
    .all(preProcessor.extensions)
    .tryInOrder(readSource)
    .then(preProcessor.render)
    .then(postProcessor.render);
}

module.exports = function getCss(req, res) {
  var playground = req.playground;

  res.set('Content-Type', mime.lookup('.css'));

  Bluebird.join(
      Bluebird.try(getPreProcessor, [playground]).then(getPreProcessorDefination),
      Bluebird.try(getPostProcessor, [playground]).then(getPostProcessorDefination)
    )
    .spread(renderResource)
    .then(res.send.bind(res))
    .tapOnError(logErrorMsg)
    .catch(_.ary(_.partial(res.sendStatus.bind(res), 500), 0));
};
