'use strict';

var path = require('path');

var PLAYGROUND_FILES   = ['playground.yml', 'playground.yaml', 'playground.json'];
var DEFAULT_PLAYGROUND = PLAYGROUND_FILES[0];
var TMPL_PLAYGROUND    = path.join(__dirname, '..', 'template', DEFAULT_PLAYGROUND);
var TMPL_HTML          = path.join(__dirname, '..', 'template', 'html.html');

module.exports = {
  PLAYGROUND_FILES: PLAYGROUND_FILES,
  DEFAULT_PLAYGROUND: DEFAULT_PLAYGROUND,
  TMPL_PLAYGROUND: TMPL_PLAYGROUND,
  TMPL_HTML: TMPL_HTML,
};
