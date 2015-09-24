'use strict';

var path = require('path');

var PLAYGROUND_FILES = ['playground.yml', 'playground.yaml', 'playground.json'];
var DEFAULT_PLAYGROUND = PLAYGROUND_FILES[0];
var TEMPLATE_PLAYGROUND =
  path.join(__dirname, '..', 'template', DEFAULT_PLAYGROUND);

module.exports = {
  PLAYGROUND_FILES: PLAYGROUND_FILES,
  DEFAULT_PLAYGROUND: DEFAULT_PLAYGROUND,
  TEMPLATE_PLAYGROUND: TEMPLATE_PLAYGROUND
};
