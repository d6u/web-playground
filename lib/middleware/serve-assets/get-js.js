'use strict';

var Bluebird      = require('../../promise/bluebird-mod');
var _             = require('lodash');
var mime          = require('mime');
var logError      = require('../../util/log').error;
var readFileAsync = require('../../util/read-file-async');
var preProcessors = require('../../js').preProcessors;
var getOrThrow    = require('../../util/get-or-throw');
var Errors        = require('../../errors');

var UnsupportedProcessorError = Errors.UnsupportedProcessorError;

var readSource = _.modArgs(readFileAsync, function (ext) {
  return './javascript.' + ext;
});

var getPreProcessor           = _.partial(_.get, _, 'js.preprocessor', 'js');
var getPreProcessorDefination = _.partial(getOrThrow, preProcessors, _, UnsupportedProcessorError);
var logErrorMsg               = _.flow(_.partial(_.get, _, 'message'), logError);

function renderResource(preProcessor) {
  return Bluebird
    .all(preProcessor.extensions)
    .tryInOrder(readSource)
    .then(preProcessor.render);
}

module.exports = function getJs(req, res) {
  var playground = req.playground;

  res.set('Content-Type', mime.lookup('.js'));

  Bluebird
    .try(getPreProcessor, [playground])
    .then(getPreProcessorDefination)
    .then(renderResource)
    .then(res.send.bind(res))
    .tapOnError(logErrorMsg)
    .catch(_.ary(_.partial(res.sendStatus.bind(res), 500), 0));
};
