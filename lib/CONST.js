'use strict';

const join = require('path').join;

const TMPL_PATH = join(__dirname, '..', 'template');

const PLAYGROUND_FILES = ['playground.yml', 'playground.yaml', 'playground.json'];
const DEFAULT_PLAYGROUND_FILE = PLAYGROUND_FILES[0];
const PLAYGROUND_EXAMPLE = join(TMPL_PATH, 'playground.yml');
const HTML_EXAMPLE = join(TMPL_PATH, 'html.html');
const HTML_TMPL = join(TMPL_PATH, 'index.ejs');
const ERROR_TMPL = join(TMPL_PATH, 'errors.ejs');
const CSS_RESET_PATH = join(__dirname, '..', 'static', 'reset.css');
const CSS_NORMALIZE_PATH = require.resolve('normalize.css');
const CSS_CONTENT_TYPE = 'text/css; charset=UTF-8';
const JS_CONTENT_TYPE = 'text/javascript; charset=UTF-8';

const WPG_DEFAULT_OPTS = {
  port: 3000,
};

const DEFAULT_PLAYGROUND_CONTENT = {
  title: 'An Enjoyable Playground',
  stylesheets: [],
  scripts: [],
  cssBase: null,
};

module.exports = {
  PLAYGROUND_FILES,
  DEFAULT_PLAYGROUND_FILE,
  PLAYGROUND_EXAMPLE,
  HTML_EXAMPLE,
  HTML_TMPL,
  ERROR_TMPL,
  WPG_DEFAULT_OPTS,
  DEFAULT_PLAYGROUND_CONTENT,
  CSS_RESET_PATH,
  CSS_NORMALIZE_PATH,
  CSS_CONTENT_TYPE,
  JS_CONTENT_TYPE,
};
