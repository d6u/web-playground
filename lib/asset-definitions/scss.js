'use strict';

const Bluebird = require('bluebird');
const R = require('ramda');
const resolveModule = require('../util/Module').resolveModule;
const RenderError = require('../ServeAssets').RenderError;

module.exports = function renderScss(str) {
  return resolveModule('node-sass')
    .then(function (sass) {
      return Bluebird.fromNode(function (cb) {
        sass.render({data: str, outputStyle: 'expanded'}, cb);
      });
    })
    .then(R.prop('css'))
    .catch(function (err) {
      return new RenderError(err.message);
    });
};
