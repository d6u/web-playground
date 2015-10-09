'use strict';

const R = require('ramda');
const ejs = require('ejs');
const File = require('../util/file');
const CONST = require('../CONST');

module.exports = function getRoot(req, res) {
  let p;

  if (this.assets['htmlErr'] || this.assets['jsErr'] || this.assets['cssErr']) {
    p = File.readFile(CONST.ERROR_TMPL).then((tmpl) => ejs.render(tmpl, {
      htmlErr: this.assets['htmlErr'],
      cssErr: this.assets['cssErr'],
      jsErr: this.assets['jsErr'],
    }));
  } else {
    p = File.readFile(CONST.HTML_TMPL).then((tmpl) =>
      ejs.render(tmpl, R.merge({fragment: this.assets['html']}, this.locals)));
  }

  p.then(res.send.bind(res));
};
