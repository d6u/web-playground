'use strict';

var R = require('ramda');

module.exports = function getJs(req, res) {
  res.set('Content-Type', 'text/javascript; charset=UTF-8');
  res.send(this.assets['js']);
};
