'use strict';

var assert = require('assert');
var inherits = require('util').inherits;
var Observable = require('rx').Observable;
var R = require('ramda');
var pipe = R.pipe;
var of = R.of;
var append = R.append;

function NoMoreFallbacksError() {
  Error.call(this);
  Error.captureStackTrace(this, NoMoreFallbacksError);
  this.message = 'No more fallback candidates';
  this.name = 'NoMoreFallbacksError';
}

inherits(NoMoreFallbacksError, Error);

function createFallbackCandidates(arr) {
  assert(arr.length > 0, 'array must contain at least one element');
  var i = -1;
  return Observable.defer(function () {
    i += 1;
    if (i >= arr.length) {
      throw new NoMoreFallbacksError();
    }
    var el = arr[i];
    return Observable.just(el);
  });
}

function tryInOrder(candidates, selector) {
  return createFallbackCandidates(candidates)
    .flatMap(function (candidate) {
      return selector(candidate)
        .map(pipe(of, append(candidate)));
    })
    .retryWhen(function (errors) {
      return errors.do(function (err) {
        if (err instanceof NoMoreFallbacksError) {
          throw err;
        }
      });
    });
}

module.exports = {
  NoMoreFallbacksError: NoMoreFallbacksError,
  createFallbackCandidates: createFallbackCandidates,
  tryInOrder: tryInOrder,
};
