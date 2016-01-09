import { Readable } from 'stream';
import { wrap } from 'co';
import hasRequire from 'has-require';
import browserify from 'browserify';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';

function createReadableStream(str) {
  const r = new Readable({objectMode: true});
  r._read = function () {
    r.push(str);
    r.push(null);
  };
  return r;
}

const bundle = wrap(function *(str) {
  const buf = yield new fromCallback((done) => {
    const b = browserify({
      entries: createReadableStream(str),
      basedir: process.cwd()
    });

    b.bundle(done);
  });

  return buf.toString('utf8');
});

export const bundleDependencies = wrap(function *(str) {
  if (hasRequire.any(str)) {
    try {
      return yield bundle(str);
    } catch (err) {
      return new RenderError(err.message);
    }
  }
  return str;
});
