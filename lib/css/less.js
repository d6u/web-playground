'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');
var renderAsync = Bluebird.promisify(require('less').render);

var getCss = _.partial(_.get, _, 'css');

module.exports = function renderLess(code) {
  return renderAsync(code).then(getCss);
};
