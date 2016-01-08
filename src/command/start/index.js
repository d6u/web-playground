import { wrap } from 'co';
import koa from 'koa';
import { create as createBrowserSync } from 'browser-sync';
import ServeAssets from '../../ServeAssets';
import { getAvailablePort } from '../../util/OptionUtil';
import startWatcher from './startWatcher';
import { error } from '../../util/Log';

export default wrap(function *(opts) {

  const port = yield getAvailablePort();

  const serveAssets = new ServeAssets();
  const app = koa();
  app.use(serveAssets.router());
  app.use(function *(next) {
    try {
      yield next;
    } catch (err) {
      this.status = 500;
      this.body = 'Something broke!';
      error(err);
    }
  });
  app.listen(port);

  const bs = createBrowserSync();
  bs.init({
    proxy: `http://localhost:${port}`,
    ui: false,
    notify: false,
    ghostMode: false,
    open: opts.openBrowser,
  });

  yield startWatcher(opts, serveAssets, bs);
});
