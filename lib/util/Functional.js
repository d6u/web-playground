'use strict';

const later = (func) => function () {
  const args = arguments;
  return function () {
    return func.apply(this, args);
  };
};

const noop = () => {};

module.exports = {
  later,
  noop,
};
