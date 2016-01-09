import { wrap } from 'co';
import koa from 'koa';
import { create as createBrowserSync } from 'browser-sync';
import { fromCallback } from 'bluebird';
import ServeAssets from '../../ServeAssets';
import { getAvailablePort } from '../../util/OptionUtil';
import startWatcher from './startWatcher';
import { error } from '../../util/Log';

function startBrowserSync(port, openBrowser) {
  return fromCallback(function (done) {
    const bs = createBrowserSync();
    const bsOpts = {
      proxy: `http://localhost:${port}`,
      ui: false,
      notify: false,
      ghostMode: false,
      open: openBrowser,
    };
    bs.init(bsOpts, () => done(null, bs));
  });
}

function startServer(port) {
  return fromCallback(function (done) {
    const serveAssets = new ServeAssets();
    const app = koa();
    serveAssets.configRouter(app);
    app.use(function *(next) {
      try {
        yield next;
      } catch (err) {
        this.status = 500;
        this.body = 'Something broke!';
        error(err);
      }
    });
    app.listen(port, '0.0.0.0', (err) => {
      done(err, serveAssets);
    });
  });
}

export default wrap(function *({ openBrowser, targetDir, liveReload }) {

  const port = yield getAvailablePort();

  const [serveAssets, bs] = yield [
    startServer(port),
    startBrowserSync(port, openBrowser)
  ];

  yield startWatcher({ targetDir, liveReload }, serveAssets, bs);
});
