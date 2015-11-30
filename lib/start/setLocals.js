'use strict';

const CONST = require('../CONST');
const Functional = require('../util/Functional');
const R = require('ramda');

const getLocalsFromPlayground = R.converge(
  (title, cssBase, stylesheets, scripts) => ({title, cssBase, stylesheets, scripts}),
  [
    R.prop('title'),
    R.path(['css', 'base']),
    R.path(['css', 'external']),
    R.path(['js', 'external']),
  ]
);

module.exports = R.curry(function (serveAssets, playground) {
  const setLocalsWithPlayground = R.pipe(
    getLocalsFromPlayground,
    Functional.defaultToProps(CONST.DEFAULT_PLAYGROUND_CONTENT),
    serveAssets.setLocals
  );

  setLocalsWithPlayground(playground);
});
