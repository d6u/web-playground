'use strict';

var R = require('ramda');
var ejs = require('ejs');
var File = require('../util/file');
var CONST = require('../CONST');

module.exports = function getRoot(req, res) {
  var self = this;

  File.readFile(CONST.HTML_TMPL)
    .map(function (tmpl) {
      return ejs.render(tmpl, R.merge({fragment: self.assets['html']}, self.locals));
    })
    .subscribeOnNext(res.send.bind(res));
};
