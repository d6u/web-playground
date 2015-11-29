'use strict';

const R = require('ramda');
const ejs = require('ejs');
const co = require('co');
const File = require('../util/File');
const CONST = require('../CONST');

module.exports = co.wrap(function *(req, res) {
  let html;

  if (this.assets['htmlErr'] || this.assets['jsErr'] || this.assets['cssErr']) {
    const tmpl = yield File.readFile(CONST.ERROR_TMPL);
    html = ejs.render(tmpl, {
      htmlErr: this.assets['htmlErr'],
      cssErr: this.assets['cssErr'],
      jsErr: this.assets['jsErr'],
    });
  } else {
    const tmpl = yield File.readFile(CONST.HTML_TMPL);
    html = ejs.render(tmpl, R.merge({fragment: this.assets['html']}, this.locals));
  }

  res.send(html);
});
