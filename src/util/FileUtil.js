import co, {wrap} from 'co';
import {access, readFile, writeFile} from 'mz/fs';
import {join, basename} from 'path';
import {R_OK} from 'fs';

const CONFIG_FILES = ['playground.yml', 'playground.yaml', 'playground.json'];

export function getDefaultConfigPath(dir) {
  return join(dir, CONFIG_FILES[0]);
}

export const getConfigPath = wrap(function *(dir) {
  for (const file of CONFIG_FILES) {
    const fpath = join(dir, file);
    try {
      yield access(fpath, R_OK)
    } catch (err) {
      continue;
    }
    return fpath;
  }
  return null;
});

export const copyTmpl = wrap(function *(destPath) {
  const fname = basename(destPath);
  const fpath = join(__dirname, '..', '..', 'template', fname);
  let fcontent;
  try {
    fcontent = yield readFile(fpath);
  } catch (err) {
    fcontent = new Buffer('', 'utf8');
  }
  yield writeFile(destPath, fcontent);
});
