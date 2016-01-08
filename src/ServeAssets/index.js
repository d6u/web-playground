import assert from 'assert';
import { curry, contains } from 'ramda';
import { RenderError } from '../error';
import getCss from './getCss';
import getCssNormalize from './getCssNormalize';
import getCssReset from './getCssReset';
import getJs from './getJs';
import getRoot from './getRoot';

export default class ServeAssets {
  constructor() {
    this.assets = {
      html: null,
      js: null,
      css: null,
      htmlErr: null,
      jsErr: null,
      cssErr: null,
    };

    this.locals = {};

    this.setLocals = (locals) => this.locals = locals;

    /**
     * Update router asset map
     *
     * @param  {string}             type    'html', 'js' or 'css'
     * @param  {string|RenderError} content Content of asset, or error to show when during render
     *
     * @return {void}
     */
    this.updateAsset = curry((type, content) => {
      assert(contains(type, ['html', 'js', 'css']), 'type must be "html", "js" or "css"');
      assert(content != null, 'must provide "content"');

      if (content instanceof RenderError) {
        this.assets[type + 'Err'] = content;
      } else {
        this.assets[type + 'Err'] = null;
        this.assets[type] = content;
      }
    });

    this.router = () => {
      const self = this;

      return function *(next) {
        switch (this.url) {
        case '/':
          yield getRoot.call(this, next, self);
          break;
        case '/js.js':
          yield getJs.call(this, next, self);
          break;
        case '/css.css':
          yield getCss.call(this, next, self);
          break;
        case '/reset.css':
          yield getCssReset.call(this, next, self);
          break;
        case '/normalize.css':
          yield getCssNormalize.call(this, next, self);
          break;
        default:
          this.status = 404;
        }
      };
    };
  }
}
