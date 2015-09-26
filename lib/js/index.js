'use strict';

var unaryJust = require('../util/observables').unaryJust;

exports.preProcessors = {
  js: {
    extensions: ['js'],
    render: unaryJust,
  },
  // babel: {
  //   extensions: ['js', 'jsx', 'es6', 'es'],
  //   render: require('./babel'),
  // },
  // coffeescript: {
  //   extensions: ['coffee'],
  //   render: require('./coffeescript'),
  // },
  // typescript: {
  //   extensions: ['ts'],
  //   render: require('./typescript'),
  // },
};
