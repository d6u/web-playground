'use strict';

var unaryJust = require('../util/observables').unaryJust;

exports.preProcessors = {
  html: {
    extensions: ['html'],
    render: unaryJust,
  },
  // jade: {
  //   extensions: ['jade'],
  //   render: require('./jade'),
  // },
  ejs: {
    extensions: ['ejs'],
    render: require('./ejs'),
  },
  // swig: {
  //   extensions: ['swig'],
  //   render: require('./swig'),
  // },
};
