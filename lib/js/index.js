'use strict';

var preprocessors = {
  js: require('../util/identity-promise'),
  babel: require('./babel.js'),
};

exports.render = function render(opts, code) {
  return preprocessors[opts.preprocessor](code);
};
