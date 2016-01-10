import { join } from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import { Observable } from 'rx';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';

function createOptions(targetDir) {
  return {
    entry: [join(targetDir, 'js.js')],
    output: {
      path: targetDir,
      filename: 'bundle.js',
    },
    loaders: [
      {
        test: /\.(js|es6|es|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  };
}

/**
 * Bundle JS file with CommonJS module, return the bundled JS file as string
 *
 * @param {string} targetDir - The directory contains `js.js` file
 *
 * @return {Promise<string>} Bundled js file content
 */
export function createBundle(targetDir) {
  return fromCallback((done) => {
    const fs = new MemoryFS();

    const compiler = webpack(createOptions(targetDir));

    compiler.outputFileSystem = fs;

    compiler.run((err, stats) => {
      if (err) {
        done(err);
        return;
      }

      const fcontent = fs.readFileSync(join(targetDir, 'bundle.js'), 'utf8');
      done(null, fcontent);
    });
  });
}

/**
 * Create a stream that emits JS file on file changes
 *
 * @param {string} targetDir - The directory contains `js.js` file
 *
 * @return {Observable<string>} Emit bundled JS file content
 */
export function createBundlerStream(targetDir) {
  return Observable.create((observer) => {
    const fs = new MemoryFS();

    const compiler = webpack(createOptions(targetDir));

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
