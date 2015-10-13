#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-b, --bundle', 'bundle you playground into a single HTML file, which can be uploaded to the Internet')
  .option('-d, --target-dir <dir-name>', 'target different directory')
  .option('--no-open-browser', 'do not auto open a new browser window when start')
  .option('--no-live-reload', 'disable live reloading (auto refresh browser when file changes)')
  .parse(process.argv);

require('../lib')({
  bundle: program.bundle,
  targetDir: program.targetDir,
  openBrowser: program.openBrowser,
  liveReload: program.liveReload,
});
