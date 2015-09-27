'use strict';

var assert = require('assert');
var R = require('ramda');
var ejs = require('ejs');
var path = require('path');
var File = require('../util/file');

var TMPL_PATH = path.join(__dirname, '..', '..', 'template', 'index.ejs');

function assertCssBaseOption(base) {
  assert(['reset', 'normalize', null].indexOf(base) > -1, 'CSS base can only be "reset" or "normalize"');
}

var getBaseCss = R.pipe(R.path(['css', 'external']), R.defaultTo(null), R.tap(assertCssBaseOption));
var getExternalCss = R.pipe(R.path(['css', 'external']), R.defaultTo([]));
var getExternalJs = R.pipe(R.path(['js', 'external']), R.defaultTo([]));

module.exports = function getRoot(req, res) {
  var self = this;
  var playground = this.playground;

  File.readFile(TMPL_PATH)
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
