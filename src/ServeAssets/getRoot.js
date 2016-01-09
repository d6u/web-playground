import { render } from 'ejs';
import { merge } from 'ramda';
import { readAsset } from '../util/FileUtil';

export default function (serveAssets) {

  return function *() {

    const hasError = serveAssets.assets['htmlErr'] ||
      serveAssets.assets['jsErr'] ||
      serveAssets.assets['cssErr'];

    if (hasError) {
      const tmpl = yield readAsset('errors.ejs');
      this.body = render(tmpl, {
        htmlErr: serveAssets.assets['htmlErr'],
        cssErr: serveAssets.assets['cssErr'],
        jsErr: serveAssets.assets['jsErr'],
      });
    } else {
      const tmpl = yield readAsset('index.ejs');
      const locals = merge({fragment: serveAssets.assets['html']}, serveAssets.locals);
      this.body = render(tmpl, locals);
    }
  };
}
