'use strict';

var Bluebird = require('bluebird');
var renderAsync = Bluebird.promisify(require('node-sass').render);
var getCss = require('../util/get')('css', null);

module.exports = function renderScss(code) {
  return renderAsync({data: code, outputStyle: 'expanded'})
    .then(getCss);
};
