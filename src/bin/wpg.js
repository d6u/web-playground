#!/usr/bin/env node

import { resolve } from 'path';
import program from 'commander';
import { install } from 'source-map-support';
import { pick, merge } from 'ramda';
import pkg from '../../package.json';
import init from '../command/init';
import start from '../command/start';
import {error} from '../util/Log';
import bundle from '../command/bundle';

install();

const pickOpts = pick(['targetDir', 'openBrowser', 'liveReload']);

program
  .version(pkg.version)
  .option('-d, --target-dir <dir-name>', 'target different directory', (dir) => resolve(dir), process.cwd());

program
  .command('init')
  .description('create boilerplate files in current directory')
  .action(() => init(pickOpts(program)).catch(error));

program
  .command('start')
  .description('load config and start local server')
  .option('--no-open-browser', 'do not auto open a new browser window when start')
  .option('--no-live-reload', 'disable live reloading (auto refresh browser when file changes)')
  .action((cmd) => start(merge(pickOpts(program), pickOpts(cmd))).catch(error));

program
  .command('bundle')
  .description('bundle all asserts into a single HTML file')
  .action(() => bundle(pickOpts(program)).catch(error));

program.parse(process.argv);
