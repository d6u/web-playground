'use strict';

var CONST = require('../CONST');

module.exports = function getJs(req, res) {
  res.set('Content-Type', CONST.JS_CONTENT_TYPE);
  res.send(this.assets['js']);
};
