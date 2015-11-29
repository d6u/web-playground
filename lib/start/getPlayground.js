'use strict';

const co = require('co');
const File = require('../util/File');
const Playground = require('../util/Playground');
const R = require('ramda');

module.exports = R.curryN(2, co.wrap(function *(file) {
  const playgroundFileContent = yield File.readFile(file);
  const playgroundFileExt = Playground.getExt(file);
  return Playground.parse(playgroundFileExt, playgroundFileContent);
}));
