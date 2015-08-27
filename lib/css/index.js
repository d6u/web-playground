'use strict';

exports.preProcessors = {
  css: {
    extensions: ['css'],
    render: require('../util/identity-async'),
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
    render: require('../util/identity-async'),
  },
  autoprefixer: {
    render: require('./autoprefixer'),
  },
};
