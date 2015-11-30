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

class NoMoreFallbacksError extends Error {
  constructor() {
    super();
    Error.captureStackTrace(this, NoMoreFallbacksError);
    this.message = 'No more element can be tried in provided list';
    this.name = 'NoMoreFallbacksError';
  }
}

module.exports = {
  UnsupportedProcessorError,
  RenderError,
  NoMoreFallbacksError,
};
