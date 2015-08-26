'use strict';

var Bluebird = require('bluebird');
var renderAsync = Bluebird.promisify(require('stylus').render);

module.exports = function renderStylus(code) {
  return renderAsync(code);
};
