'use strict';

const co = require('co');
const ejs = require('ejs');
const File = require('../../util/File');
const Functional = require('../../util/Functional');
const Log = require('../../util/Log');
const CONST = require('../../CONST');
const R = require('ramda');
const Errors = require('../../errors');
const PathUtil = require('../../util/PathUtil');
const PromiseUtil = require('../../util/PromiseUtil');
const Playground = require('../../util/Playground');

function getCssBaseContent(cssBase) {
  switch (cssBase) {
  case 'reset':
    return File.readFile(CONST.CSS_RESET_PATH);
  case 'normalize':
    return File.readFile(CONST.CSS_NORMALIZE_PATH);
  default:
    return null;
  }
}

const loadPlayground = co.wrap(function *(opts) {
  const getFullPath = File.join(opts.baseDir);
  const paths = R.map(getFullPath, CONST.PLAYGROUND_FILES);
  const results = yield PromiseUtil.tryInOrder(File.readFile, paths);
  const playgroundFilePath = results[0];
  const playgroundFileContent = results[1];
  const ext = Playground.getExt(playgroundFilePath);
  return Playground.parse(ext, playgroundFileContent);
});

const throwIfRenderError = R.when(R.is(Errors.RenderError), (err) => {
  throw err;
});

function checkLocals(locals) {
  throwIfRenderError(locals.html);
  throwIfRenderError(locals.js);
  throwIfRenderError(locals.css);
}

const renderToFile = co.wrap(function *(opts, template, locals) {
  const completedLocals = Functional.defaultToProps(CONST.DEFAULT_PLAYGROUND_CONTENT, locals);

  const targetFileContent = ejs.render(template, completedLocals);
  const targetFilePath = PathUtil.joinTwo(opts.baseDir, 'index.html');

  Log.logCreateFile(targetFilePath);

  yield File.writeFile(targetFilePath, targetFileContent);
});

module.exports = {
  getCssBaseContent,
  loadPlayground,
  checkLocals,
  renderToFile,
};
