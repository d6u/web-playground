#!/usr/bin/env node

import program from 'commander';
import {pick} from 'ramda';
import pkg from '../../package.json';
import init from '../command/init';

const pickOpts = pick(['targetDir', 'openBrowser', 'liveReload']);

program
  .version(pkg.version)
  .option('-d, --target-dir <dir-name>', 'target different directory')

program
  .command('init')
  .description('create boilerplate files in current directory')
  .action(() => init(pickOpts(program)).catch((err) => console.error(err.stack)));

program
  .command('start')
  .description('load config and start local server')
  .option('--no-open-browser', 'do not auto open a new browser window when start')
  .option('--no-live-reload', 'disable live reloading (auto refresh browser when file changes)')
  .action();

program
  .command('bundle')
  .description('bundle all asserts into a single HTML file')
  .action();

program.parse(process.argv);
