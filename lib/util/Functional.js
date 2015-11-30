'use strict';

const R = require('ramda');

const defaultToProps = R.curry((defaultProps, props) => {
  return R.pipe(
    R.union,
    R.map((key) => [key, R.defaultTo(defaultProps[key], props[key])]),
    R.fromPairs
  )(R.keys(defaultProps), R.keys(props));
});

module.exports = {
  defaultToProps,
};
