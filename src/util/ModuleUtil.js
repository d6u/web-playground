import {promisify} from 'bluebird';
import resolve from 'resolve';

const resolveAsync = promisify(resolve, {multiArgs: true});

const resolveModule = (name) =>
  resolveAsync(name, {basedir: process.cwd()})
    .catch(() => resolveAsync(name, {basedir: __dirname}))
    .spread((path, pkg) => require(path));

module.exports = {
  resolveModule,
};
