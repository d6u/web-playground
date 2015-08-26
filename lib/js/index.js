'use strict';

exports.preProcessors = {
  js: {
    extensions: ['js'],
    render: require('../util/identity-promise'),
  },
  babel: {
    extensions: ['js', 'jsx', 'es6', 'es'],
    render: require('./babel.js'),
  },
  coffeescript: {
    extensions: ['coffee'],
    render: require('./coffeescript.js'),
  },
  typescript: {
    extensions: ['ts'],
    render: require('./typescript.js'),
  },
};
