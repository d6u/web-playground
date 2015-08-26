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
  less: {
    extensions: ['less'],
    render: require('./less'),
  },
  stylus: {
    extensions: ['stylus'],
    render: require('./stylus'),
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
