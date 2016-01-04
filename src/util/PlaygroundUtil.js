import {wrap} from 'co';
import {access, readFile} from 'mz/fs';
import {R_OK} from 'fs';
import {safeLoad} from 'js-yaml';
import {extname, join} from 'path';
import {__, curry, curryN, pipe, path, defaultTo, prop} from 'ramda';
import * as assetDefinitions from '../assetDefinitions';

export const loadConfig = wrap(function *(fpath) {
  const fcontent = yield readFile(fpath, 'utf8');
  const ftype = extname(fpath).slice(1);

  switch (ftype) {
  case 'yml':
  case 'yaml':
    return safeLoad(fcontent);
  case 'json':
    return JSON.parse(fcontent);
  default:
    throw new Error(`"${ftype}" is not a recongnizable config file type`);
  }
});

function extensionsForAsset(type, config) {
  return pipe(
    path([type, 'preprocessor']),
    defaultTo(type),
    prop(__, assetDefinitions[type].preProcessors),
    prop('extensions')
  )(config);
}

const getPathForAsset = curryN(3, wrap(function *(type, dir, config) {
  const exts = extensionsForAsset(type, config);
  for (const ext of exts) {
    const fpath = join(dir, `${type}.${ext}`);
    try {
      yield access(fpath, R_OK);
    } catch (err) {
      continue;
    }
    return fpath;
  }
  return null;
}));

const getDefaultPathForAsset = curry(function (type, dir, config) {
  const [ext,] = extensionsForAsset(type, config);
  return join(dir, `${type}.${ext}`);
});

export const getJsFilePath = getPathForAsset('js');
export const getCssFilePath = getPathForAsset('css');
export const getHtmlFilePath = getPathForAsset('html');
export const getDefaultJsFilePath = getDefaultPathForAsset('js');
export const getDefaultCssFilePath = getDefaultPathForAsset('css');
export const getDefaultHtmlFilePath = getDefaultPathForAsset('html');
