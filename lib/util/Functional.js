'use strict';

const R = require('ramda');

const later = (func) => function () {
  const args = arguments;
  return function () {
    return func.apply(this, args);
  };
};

const noop = () => {};

const defaultToProps = R.curry((defaultProps, props) => {
  return R.compose(
    R.fromPairs,
    R.map((key) => [key, R.defaultTo(defaultProps[key], props[key])]),
    R.union
  )(R.keys(defaultProps), R.keys(props));
});

module.exports = {
  later,
  noop,
  defaultToProps,
};
