'use strict';

const R = require('ramda');
const preStart = require('./preStart');
const Options = require('./util/Options');

module.exports = (_opts) => preStart(() => Options.mergeDefault(_opts).then((opts) => {
  if (opts.bundle) {
    require('./bundle')();
    return;
  }

  require('./start')(R.omit(['bundle'], opts));
}));
