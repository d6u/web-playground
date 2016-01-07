import {wrap} from 'co';
import express from 'express';
import {create as createBrowserSync} from 'browser-sync';
import ServeAssets from '../../ServeAssets';
import {getAvailablePort} from '../../util/OptionUtil';
import startWatcher from './startWatcher';

export default wrap(function *(opts) {

  const port = yield getAvailablePort();

  const serveAssets = new ServeAssets();
  const app = express();
  app.use(serveAssets.router);
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
