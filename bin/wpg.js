#!/usr/bin/env node

'use strict';

var program = require('commander');
var packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description(packageJson.description)
  .parse(process.argv);

require('../lib')();
