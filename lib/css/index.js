'use strict';

var preprocessors = {
  css: require('../util/identity-promise'),
  scss: require('./scss'),
};

var postProcessors = {
  raw: require('../util/identity-promise'),
  autoprefixer: require('./autoprefixer'),
};

exports.render = function render(opts, code) {
  return preprocessors[opts.preprocessor](code)
    .then(postProcessors[opts.venderPrefixing]);
};
