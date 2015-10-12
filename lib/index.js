'use strict';

const R = require('ramda');
const preStart = require('./preStart');
const Functional = require('./util/Functional');

const CONST = require('./CONST');

module.exports = (_opts) => preStart(() => {
  const opts = Functional.defaultToProps(CONST.WPG_DEFAULT_OPTS, _opts);

  if (opts.bundle) {
    require('./bundle')();
    return;
  }

  require('./start')(R.omit(['bundle'], opts));
});
