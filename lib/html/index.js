'use strict';

var preprocessors = {
  html: require('../util/identity-promise'),
  jade: require('./jade.js'),
};

exports.render = function render(opts, code) {
  return preprocessors[opts.preprocessor](code);
};
