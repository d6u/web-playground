'use strict';

class UnsupportedProcessorError extends Error {
  constructor(name) {
    super();
    Error.captureStackTrace(this, UnsupportedProcessorError);
    this.message = `"${name}" is not a supported processor.`;
    this.name = 'UnsupportedProcessorError';
  }
}

module.exports = {
  UnsupportedProcessorError,
};
