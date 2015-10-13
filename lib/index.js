'use strict';

const R = require('ramda');
const chalk = require('chalk');
const preStart = require('./preStart');
const Options = require('./util/Options');
const Log = require('./util/Log');

module.exports = _opts => preStart().spread(hasCreatedFromTmpl => {
  if (hasCreatedFromTmpl) {
    Log.info(`Run ${chalk.green('wpg')} again to start live-reload server`);
    return;
  }

  Options.mergeDefault(_opts).then(opts => {
    if (opts.bundle) {
      require('./bundle')();
      return;
    }

    const startOpts = R.omit(['bundle'], opts);

    require('./start')(startOpts);
  });
});
