import { join } from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import { Observable } from 'rx';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';

export function createBundle(targetDir) {
  return fromCallback((done) => {
    const fs = new MemoryFS();

    const compiler = webpack({
      entry: [join(targetDir, 'js.js')],
      output: {
        path: targetDir,
        filename: 'bundle.js',
      }
    });

    compiler.outputFileSystem = fs;

    compiler.run({}, (err, stats) => {
      if (err) {
        done(err);
        return;
      }

      const fcontent = fs.readFileSync(join(targetDir, 'bundle.js'), 'utf8');
      done(null, fcontent);
    });
  });
}

export function createBundlerStream(targetDir) {
  return Observable.create((observer) => {
    const fs = new MemoryFS();

    const compiler = webpack({
      entry: [join(targetDir, 'js.js')],
      output: {
        path: targetDir,
        filename: 'bundle.js',
      }
    });

    compiler.outputFileSystem = fs;

    const watcher = compiler.watch({}, (err, stats) => {
      if (err) {
        observer.onNext(new RenderError(err.message));
        return;
      }

      const fontent = fs.readFileSync(join(targetDir, 'bundle.js'), 'utf8');
      observer.onNext(fontent);
    });

    return () => watcher.close();
  });
}
