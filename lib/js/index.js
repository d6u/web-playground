'use strict';

exports.preProcessors = {
  js: {
    extensions: ['js'],
    render: require('../util/identity-promise'),
  },
  babel: {
    extensions: ['js', 'jsx', 'es6', 'es'],
    render: require('./babel'),
  },
  coffeescript: {
    extensions: ['coffee'],
    render: require('./coffeescript'),
  },
  typescript: {
    extensions: ['ts'],
    render: require('./typescript'),
  },
};
