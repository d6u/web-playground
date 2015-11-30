'use strict';

const Bluebird = require('bluebird');
const co = require('co');
const CONST = require('../CONST');
const File = require('../util/File');
const Log = require('../util/Log');
const PathUtil = require('../util/PathUtil');
const Playground = require('../util/Playground');
const PromiseUtil = require('../util/PromiseUtil');
const R = require('ramda');

module.exports = co.wrap(function *(opts) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);
  const tryReadFile = R.converge(Bluebird.join, [R.identity, R.compose(File.readFile, getFullPath)]);

  let hasCreatedFromTmpl = false;
  let playgroundFileName;
  let playgroundFileContent;

  try {
    const results = yield PromiseUtil.tryInOrder(tryReadFile, CONST.PLAYGROUND_FILES);
    playgroundFileName = results[0];
    playgroundFileContent = results[1];
  } catch (err) {
    Log.info('Did not find playground file, creating one...');
    hasCreatedFromTmpl = true;
    playgroundFileName = CONST.DEFAULT_PLAYGROUND_FILE;
    const playgroundFilePath = getFullPath(playgroundFileName);
    playgroundFileContent = yield File.readFile(CONST.PLAYGROUND_EXAMPLE);
    yield File.writeFile(playgroundFilePath, playgroundFileContent);
    Log.logCreateFile(playgroundFilePath);
  }

  const playgroundFileExt = Playground.getExt(playgroundFileName);
  const playground = Playground.parse(playgroundFileExt, playgroundFileContent);

  return [playground, hasCreatedFromTmpl];
});
