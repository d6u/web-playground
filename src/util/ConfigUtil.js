import { extname, join } from 'path';
import { R_OK } from 'fs';
import { wrap } from 'co';
import { access } from 'mz/fs';
import { safeLoad } from 'js-yaml';
import { readToStr } from './FileUtil';

const CONFIG_FILES = ['playground.yml', 'playground.yaml', 'playground.json'];

export const getConfigPath = wrap(function *(dir) {
  for (const file of CONFIG_FILES) {
    const fpath = join(dir, file);
    try {
      yield access(fpath, R_OK);
    } catch (err) {
      continue;
    }
    return fpath;
  }
  return null;
});

export function getDefaultConfigPath(dir) {
  return join(dir, CONFIG_FILES[0]);
}

export const loadConfig = wrap(function *(fpath) {
  const fcontent = yield readToStr(fpath);

  if (!fcontent) {
    throw new Error(`${fpath} is not a valid config file`);
  }

  const ftype = extname(fpath).slice(1);

  switch (ftype) {
  case 'yml':
  case 'yaml':
    return safeLoad(fcontent);
  case 'json':
    return JSON.parse(fcontent);
  default:
    // should not reach
  }
});

export function getConfigGlobPattern(dir) {
  const exts = CONFIG_FILES.join(',');
  return join(dir, `{${exts}}`);
}
