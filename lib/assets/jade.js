'use strict';

var Bluebird = require('bluebird');
var jade = require('jade');

module.exports = function renderJade(code) {
  return Bluebird.try(function () {
    return jade.render(code, {pretty: true});
  });
};
