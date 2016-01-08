import { join } from 'path';
import { R_OK } from 'fs';
import { wrap } from 'co';
import { access, readFile, writeFile } from 'mz/fs';
import chokidar from 'chokidar';
import { Observable } from 'rx';

export const joinTwo = (...parts) => (part) => join.apply(null, parts.concat([part]));

export function getAssetPath(name) {
  return join(__dirname, '..', '..', 'assets', name);
}

export function readToStr(fpath) {
  return readFile(fpath, 'utf8');
}

export function writeStrTo(fpath, fcontent) {
  return writeFile(fpath, fcontent, 'utf8');
}

export const watch = (pattern) => Observable.create((observer) => {
  const watcher = chokidar.watch(pattern, {
    ignored: /[\/\\]\./, // Don't care dotfiles
    persistent: true,
  });

  watcher.on('all', (event, file) => observer.onNext(file));

  return () => watcher.close();
});

export const readAsset = wrap(function *(name) {
  const fpath = getAssetPath(name);
  try {
    yield access(fpath, R_OK);
    return yield readToStr(fpath);
  } catch (err) {
    return null;
  }
});
