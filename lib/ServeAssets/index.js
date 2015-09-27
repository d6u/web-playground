'use strict';

var express = require('express');
var inherits = require('util').inherits;
var assert = require('assert');

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
  // this.router.get('/javascript.js', this.getJs.bind(this));
  // this.router.get('/css.css', this.getCss.bind(this));
  // this.router.get('/reset.css', this.getCssReset.bind(this));
  // this.router.get('/normalize.css', this.getCssNormalize.bind(this));
}

ServeAssets.prototype.getRoot = require('./getRoot');
// ServeAssets.prototype.getJs = require('./get-js');
// ServeAssets.prototype.getCss = require('./get-css');
// ServeAssets.prototype.getCssReset = require('./get-css-reset');
// ServeAssets.prototype.getCssNormalize = require('./get-css-normalize');

/**
 * Update router asset map
 * @param  {string}             type    'html', 'js' or 'css'
 * @param  {string|RenderError} content Content of asset, or error to show when during render
 * @return {void}
 */
ServeAssets.prototype.updateAsset = function (type, content) {
  assert(['html', 'js', 'css'].indexOf(type) > -1, 'type must be "html", "js" or "css"');
  assert(content != null, 'must provide "content"');

  if (content instanceof RenderError) {
    this.assets[type + 'Err'] = content;
  } else {
    this.assets[type + 'Err'] = null;
    this.assets[type] = content;
  }
};

module.exports = {
  ServeAssets: ServeAssets,
  RenderError: RenderError,
};
