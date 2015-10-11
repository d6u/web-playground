#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-b, --bundle', 'bundle you playground into a single HTML file, which can be uploaded to the Internet')
  .parse(process.argv);

require('../lib')({
  bundle: program.bundle
});
