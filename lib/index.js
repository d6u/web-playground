'use strict';

const preStart = require('./preStart');

module.exports = (opts) => preStart(() => {

  if (opts.bundle) {
    require('./bundle')();
    return;
  }

  require('./start')();
});
