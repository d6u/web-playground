'use strict';

const CONST = require('../CONST');

module.exports = function getCss(req, res) {
  res.set('Content-Type', CONST.CSS_CONTENT_TYPE);
  res.send(this.assets['css']);
};
