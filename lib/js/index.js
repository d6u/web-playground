'use strict';

exports.preProcessors = {
  js: {
    extensions: ['js'],
    render: require('../util/identity-promise'),
  },
  babel: {
    extensions: ['js'],
    render: require('./babel.js'),
  },
};
