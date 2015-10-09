'use strict';

const assert = require('assert');
const R = require('ramda');
const Observable = require('rx').Observable;

class NoMoreFallbacksError extends Error {
  constructor() {
    super();
    Error.captureStackTrace(this, NoMoreFallbacksError);
    this.message = 'No more fallback candidates';
    this.name = 'NoMoreFallbacksError';
  }
}

function createFallbackCandidates(arr) {
  assert(arr.length > 0, 'array must contain at least one element');
  let i = -1;
  return Observable.defer(function () {
    i += 1;
    if (i >= arr.length) {
      throw new NoMoreFallbacksError();
    }
    const el = arr[i];
    return Observable.just(el);
  });
}

function tryInOrder(candidates, selector) {
  return createFallbackCandidates(candidates)
    .flatMap(function (candidate) {
      return selector(candidate)
        .map(R.pipe(R.of, R.append(candidate)));
    })
    .retryWhen(function (errors) {
      return errors.do(function (err) {
        if (err instanceof NoMoreFallbacksError) {
          throw err;
        }
      });
    });
}

function observablefyPromise(func) {
  return function () {
    return Observable.fromPromise(func.apply(this, arguments));
  };
}

const createFallbacks = (candidates) => {
  assert(candidates.length > 0, 'candidates must contain at least one element');
  let i = -1;
  return Observable.defer(() => {
    i += 1;
    if (i >= candidates.length) {
      throw new NoMoreFallbacksError();
    }
    const c = candidates[i];
    return Observable.just(c);
  });
};

const tryInOrderCurry = R.curry((selector, candidates) =>
  createFallbacks(candidates).flatMap(selector).retry(candidates.length + 1));

module.exports = {
  NoMoreFallbacksError,
  createFallbackCandidates,
  tryInOrder,
  observablefyPromise,
  createFallbacks,
  tryInOrderCurry,
};
