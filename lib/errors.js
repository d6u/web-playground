'use strict';

class UnsupportedProcessorError extends Error {
  constructor(name) {
    super();
    Error.captureStackTrace(this, UnsupportedProcessorError);
    this.message = `"${name}" is not a supported processor.`;
    this.name = 'UnsupportedProcessorError';
  }
}

class RenderError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, RenderError);
    this.name = 'RenderError';
  }
}

module.exports = {
  UnsupportedProcessorError,
  RenderError,
};
