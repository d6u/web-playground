'use strict';

const R = require('ramda');

const later = (func) => function () {
  const args = arguments;
  return function () {
    return func.apply(this, args);
  };
};

const noop = () => {};

const defaultToProps = R.pipe(
  R.toPairs,
  R.map(R.adjust(R.defaultTo, 1)),
  R.fromPairs,
  R.evolve
);

module.exports = {
  later,
  noop,
  defaultToProps,
};
