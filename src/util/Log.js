/*eslint no-console:0 no-process-exit:0*/

import chalk from 'chalk';

const PREFIX = `[${chalk.green('playground')}]`;
const ERR_PREFIX = `[${chalk.red('error')}]`;

export function info(msg) {
  for (const line of msg.split('\n')) {
    console.log(`${PREFIX} ${line}`);
  }
}

export function error(msg) {
  const str = msg instanceof Error ? msg.stack : msg;
  for (const line of str.split('\n')) {
    console.log(`${ERR_PREFIX} ${line}`);
  }
  process.exit(1);
}
