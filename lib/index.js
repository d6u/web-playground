'use strict';

const chalk = require('chalk');
const preStart = require('./preStart');
const Options = require('./util/Options');
const Log = require('./util/Log');

module.exports = _opts => Options.mergeDefault(_opts).then(opts => {
  preStart(opts).spread(hasCreatedFromTmpl => {
    if (hasCreatedFromTmpl) {
      Log.info(`Run ${chalk.green('wpg')} again to start live-reload server`);
      return;
    }

    if (opts.bundle) {
      require('./bundle')(opts);
      return;
    }

    require('./start')(opts);
  });
});
