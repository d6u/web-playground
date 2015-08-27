'use strict';

exports.preProcessors = {
  html: {
    extensions: ['html'],
    render: require('../util/identity-async'),
  },
  jade: {
    extensions: ['jade'],
    render: require('./jade'),
  },
  ejs: {
    extensions: ['ejs'],
    render: require('./ejs'),
  },
  swig: {
    extensions: ['swig'],
    render: require('./swig'),
  },
};
