'use strict';

const File = require('../util/File');
const CONST = require('../CONST');

module.exports = function getCssReset(req, res) {
  res.set('Content-Type', CONST.CSS_CONTENT_TYPE);
  File.readFile(CONST.CSS_RESET_PATH)
    .then(res.send.bind(res));
};
