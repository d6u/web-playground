'use strict';

var util = require('util');

function UnsupportedProcessorError(name) {
  Error.call(this);
  Error.captureStackTrace(this, UnsupportedProcessorError);
  this.message = '"' + name + '" is not a supported processor.';
  this.name = 'UnsupportedProcessorError';
}

util.inherits(UnsupportedProcessorError, Error);

module.exports = {
  UnsupportedProcessorError: UnsupportedProcessorError,
};
