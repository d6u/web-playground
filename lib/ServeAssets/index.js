'use strict';

const express = require('express');
const assert = require('assert');
const R = require('ramda');

const getRoot = require('./getRoot');
const getJs = require('./getJs');
const getCss = require('./getCss');
const getCssReset = require('./getCssReset');
const getCssNormalize = require('./getCssNormalize');

class RenderError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, RenderError);
    this.name = 'RenderError';
  }
}

class ServeAssets {
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
    this.updateAsset = R.curry((type, content) => {
      assert(R.contains(type, ['html', 'js', 'css']), 'type must be "html", "js" or "css"');
      assert(content != null, 'must provide "content"');

      if (content instanceof RenderError) {
        this.assets[type + 'Err'] = content;
      } else {
        this.assets[type + 'Err'] = null;
        this.assets[type] = content;
      }
    });

    this.router = express.Router();

    this.router.get('/', getRoot.bind(this));
    this.router.get('/js.js', getJs.bind(this));
    this.router.get('/css.css', getCss.bind(this));
    this.router.get('/reset.css', getCssReset.bind(this));
    this.router.get('/normalize.css', getCssNormalize.bind(this));
  }
}

module.exports = {
  ServeAssets,
  RenderError,
};
