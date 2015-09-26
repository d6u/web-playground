'use strict';

var unaryJust = require('../util/observables').unaryJust;

exports.preProcessors = {
  css: {
    extensions: ['css'],
    render: unaryJust,
  },
  // scss: {
  //   extensions: ['scss'],
  //   render: require('./scss'),
  // },
  // less: {
  //   extensions: ['less'],
  //   render: require('./less'),
  // },
  // stylus: {
  //   extensions: ['stylus'],
  //   render: require('./stylus'),
  // },
};

exports.postProcessors = {
  // raw: {
  //   render: require('../util/identity-async'),
  // },
  // autoprefixer: {
  //   render: require('./autoprefixer'),
  // },
};
