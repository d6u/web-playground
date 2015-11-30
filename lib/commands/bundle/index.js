'use strict';

const co = require('co');
const CONST = require('../../CONST');
const File = require('../../util/File');
const Helpers = require('./Helpers');
const loadLocals = require('./loadLocals');

module.exports = co.wrap(function *(opts) {
  const playground = yield Helpers.loadPlayground(opts);

  const results = yield [
    File.readFile(CONST.HTML_BUNDLE_TMPL),
    loadLocals(opts, playground)
  ];

  const template = results[0];
  const locals = results[1];

  Helpers.checkLocals(locals);

  yield Helpers.renderToFile(opts, template, locals);
});
