'use strict';

var express = require('express');
var inherits = require('util').inherits;
var assert = require('assert');
var R = require('ramda');

function RenderError(message) {
  Error.call(this);
  Error.captureStackTrace(this, RenderError);
  this.message = message;
  this.name = 'RenderError';
}

inherits(RenderError, Error);

function ServeAssets() {
  this.assets = {
    html: null,
    js: null,
    css: null,
    htmlErr: null,
    jsErr: null,
    cssErr: null,
  };

  this.router = express.Router();

  this.router.get('/', this.getRoot.bind(this));
  this.router.get('/js.js', this.getJs.bind(this));
  this.router.get('/css.css', this.getCss.bind(this));
  this.router.get('/reset.css', this.getCssReset.bind(this));
  this.router.get('/normalize.css', this.getCssNormalize.bind(this));
}

ServeAssets.prototype.getRoot = require('./getRoot');
ServeAssets.prototype.getJs = require('./getJs');
ServeAssets.prototype.getCss = require('./getCss');
ServeAssets.prototype.getCssReset = require('./getCssReset');
ServeAssets.prototype.getCssNormalize = require('./getCssNormalize');

/**
 * Update router asset map
 * @param  {string}             type    'html', 'js' or 'css'
 * @param  {string|RenderError} content Content of asset, or error to show when during render
 * @return {void}
 */
ServeAssets.prototype.updateAsset = R.curryN(2, function (type, content) {
  assert(['html', 'js', 'css'].indexOf(type) > -1, 'type must be "html", "js" or "css"');
  assert(content != null, 'must provide "content"');

  if (content instanceof RenderError) {
    this.assets[type + 'Err'] = content;
  } else {
    this.assets[type + 'Err'] = null;
    this.assets[type] = content;
  }
});

module.exports = {
  ServeAssets: ServeAssets,
  RenderError: RenderError,
};
