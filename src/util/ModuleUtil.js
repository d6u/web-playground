import { promisify } from 'bluebird';
import resolve from 'resolve';
import { wrap } from 'co';

const resolveAsync = promisify(resolve);

export const resolveModule = wrap(function *(name) {
  let mpath;
  try {
    mpath = yield resolveAsync(name, {basedir: process.cwd()});
  } catch (err) {
    mpath = yield resolveAsync(name, {basedir: __dirname});
  }
  return require(mpath);
});
