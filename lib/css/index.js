'use strict';

exports.preProcessors = {
  css: {
    extensions: ['css'],
    render: require('../util/identity-promise'),
  },
  scss: {
    extensions: ['scss'],
    render: require('./scss'),
  },
};

exports.postProcessors = {
  raw: {
    render: require('../util/identity-promise'),
  },
  autoprefixer: {
    render: require('./autoprefixer'),
  },
};
