'use strict';

function later(func) {
  return function () {
    var args = arguments;
    return function () {
      return func.apply(this, args);
    };
  };
}

function noop() {
}

module.exports = {
  later: later,
  noop: noop,
};
