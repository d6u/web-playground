'use strict';

var preprocessors = {
  css: require('../util/identity-promise'),
  scss: require('./scss'),
};

var postProcessors = {
  autoprefixer: require('./autoprefixer'),
};

exports.render = function render(opts, code) {
  return preprocessors[opts.preprocessor](code)
    .then(function (css) {
      return opts.venderPrefixing ? postProcessors[opts.venderPrefixing](css) : css;
    });
};
