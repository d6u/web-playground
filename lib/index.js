'use strict';

const co = require('co');
const chalk = require('chalk');
const preStart = require('./preStart');
const Options = require('./util/Options');
const Log = require('./util/Log');

module.exports = co.wrap(function *(_opts) {
  try {
    const opts = yield Options.mergeDefault(_opts);
    const hasCreatedFromTmpl = yield preStart(opts);

    if (hasCreatedFromTmpl) {
      Log.info(`Run ${chalk.green('wpg')} again to start live-reload server`);
      return;
    }

    if (opts.bundle) {
      require('./commands/bundle')(opts);
      return;
    }

    require('./start')(opts);
  } catch (err) {
    console.log(err.stack); // eslint-disable-line no-console
  }
});
