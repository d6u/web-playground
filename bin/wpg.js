#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('../package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .parse(process.argv);

require('../lib')();
