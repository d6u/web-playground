import { wrap } from 'co';
import koa from 'koa';
import { create as createBrowserSync } from 'browser-sync';
import ServeAssets from '../../ServeAssets';
import { getAvailablePort } from '../../util/OptionUtil';
import startWatcher from './startWatcher';
import { error } from '../../util/Log';

export default wrap(function *({ openBrowser, targetDir, liveReload }) {

  const port = yield getAvailablePort();

  const bs = createBrowserSync();

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

  yield startWatcher({ targetDir, liveReload }, serveAssets, bs);

  bs.init({
    proxy: `http://localhost:${port}`,
    ui: false,
    notify: false,
    ghostMode: false,
    open: openBrowser,
  });
  app.listen(port);

});
