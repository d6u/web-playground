'use strict';

const File = require('../util/File');
const getPlayground = require('./getPlayground');
const PathUtil = require('../util/PathUtil');
const processAssetFiles = require('./processAssetFiles');
const Rx = require('rx');
const setLocals = require('./setLocals');

module.exports = function (opts, serveAssets, bs) {
  const getFullPath = PathUtil.joinTwo(opts.baseDir);

  const playgroundStream = File.watch(getFullPath('playground.*')).flatMap(getPlayground);

  const localsStream = playgroundStream.doOnNext(setLocals(serveAssets));
  const assetFilesStream = playgroundStream.flatMap(processAssetFiles(opts, serveAssets));

  Rx.Observable.merge(localsStream, assetFilesStream)
    .debounce(100)
    .subscribeOnNext(() => {
      if (opts.liveReload) {
        bs.reload();
      }
    });
};
