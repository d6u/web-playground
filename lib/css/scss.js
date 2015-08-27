'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var renderAsync = Bluebird.promisify(require('node-sass').render);

var getCss = _.partial(_.get, _, 'css');

module.exports = function renderScss(code) {
  return renderAsync({
    data: code,
    outputStyle: 'expanded'
  })
    .then(getCss);
};
