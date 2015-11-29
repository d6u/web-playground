'use strict';

class NoMoreFallbacksError extends Error {
  constructor() {
    super();
    Error.captureStackTrace(this, NoMoreFallbacksError);
    this.message = 'No more element can be tried in provided list';
    this.name = 'NoMoreFallbacksError';
  }
}

module.exports = {
  NoMoreFallbacksError,
};
