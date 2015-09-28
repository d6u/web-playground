'use strict';

var path = require('path');

var PLAYGROUND_FILES = ['playground.yml', 'playground.yaml', 'playground.json'];
var DEFAULT_PLAYGROUND_FILE = PLAYGROUND_FILES[0];
var PLAYGROUND_EXAMPLE = path.join(__dirname, '..', 'template', 'playground.yml');
var HTML_EXAMPLE = path.join(__dirname, '..', 'template', 'html.html');
var HTML_TMPL = path.join(__dirname, '..', 'template', 'index.ejs');
var ERROR_TMPL = path.join(__dirname, '..', 'template', 'errors.ejs')

var WPG_DEFAULT_OPTS = {
  port: 3000,
};

var DEFAULT_PLAYGROUND_CONTENT = {
  title: 'An Enjoyable Playground'
};

module.exports = {
  PLAYGROUND_FILES: PLAYGROUND_FILES,
  DEFAULT_PLAYGROUND_FILE: DEFAULT_PLAYGROUND_FILE,
  PLAYGROUND_EXAMPLE: PLAYGROUND_EXAMPLE,
  HTML_EXAMPLE: HTML_EXAMPLE,
  HTML_TMPL: HTML_TMPL,
  ERROR_TMPL: ERROR_TMPL,
  WPG_DEFAULT_OPTS: WPG_DEFAULT_OPTS,
  DEFAULT_PLAYGROUND_CONTENT: DEFAULT_PLAYGROUND_CONTENT,
};
