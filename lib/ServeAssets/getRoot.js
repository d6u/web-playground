'use strict';

var assert = require('assert');
var R = require('ramda');
var ejs = require('ejs');
var File = require('../util/file');
var CONST = require('../CONST');

function assertCssBase(base) {
  assert(['reset', 'normalize', null].indexOf(base) > -1, 'CSS base can only be "reset" or "normalize"');
}

var getBaseCss = R.pipe(R.path(['css', 'base']), R.defaultTo(null), R.tap(assertCssBase));
var getExternalCss = R.pipe(R.path(['css', 'external']), R.defaultTo([]));
var getExternalJs = R.pipe(R.path(['js', 'external']), R.defaultTo([]));

module.exports = function getRoot(req, res) {
  var self = this;
  var playground = this.playground;

  File.readFile(CONST.HTML_TMPL)
    .map(function (tmpl) {
      var locals = {
        title: playground.title,
        cssBase: getBaseCss(playground),
        stylesheets: getExternalCss(playground),
        fragment: self.assets['html'],
        scripts: getExternalJs(playground),
      };

      return ejs.render(tmpl, locals);
    })
    .subscribeOnNext(function (content) {
      res.send(content);
    });
};
