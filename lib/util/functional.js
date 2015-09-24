'use strict';

function later(func) {
  return function () {
    var args = arguments;
    return function () {
      return func.apply(this, args);
    };
  };
}

module.exports = {
  later: later,
};
