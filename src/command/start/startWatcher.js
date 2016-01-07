import {join} from 'path';
import {Observable} from 'rx';
import {wrap} from 'co';
import {curry, converge, prop, path, pipe, defaultTo} from 'ramda';
import {
  loadConfig,
  getJsGlobPattern,
  getCssGlobPattern,
  getHtmlGlobPattern,
  getJsRender,
  getCssRender,
  getHtmlRender,
  getPostProcessorForCss
} from '../../util/PlaygroundUtil';
import {getConfigPath, watch, readFileToStr} from '../../util/FileUtil';
import {info} from '../../util/Log';

const getLocalsFromPlayground = converge(
  (title, cssBase, stylesheets, scripts) => ({title, cssBase, stylesheets, scripts}),
  [
    prop('title'),
    path(['css', 'base']),
    path(['css', 'external']),
    path(['js', 'external']),
  ]
);

const setLocals = curry(function (serveAssets, config) {
  pipe(
    getLocalsFromPlayground,
    serveAssets.setLocals
  )(config);
});

function processHtmlFile({targetDir}, serveAssets, config) {
  return watch(getHtmlGlobPattern(targetDir, config))
    .flatMap(readFileToStr)
    .flatMap(getHtmlRender(config))
    .doOnNext(serveAssets.updateAsset('html'));
}

function processJsFile({targetDir}, serveAssets, config) {
  return watch(getJsGlobPattern(targetDir, config))
    .flatMap(readFileToStr)
    .flatMap(getJsRender(config))
    .doOnNext(serveAssets.updateAsset('js'));
}

function processCssFile({targetDir}, serveAssets, config) {
  return watch(getCssGlobPattern(targetDir, config))
    .flatMap(readFileToStr)
    .flatMap(getCssRender(config))
    .flatMap(getPostProcessorForCss(config))
    .doOnNext(serveAssets.updateAsset('css'));
}

const processAssetFiles = curry(function (opts, serveAssets, config) {
  return Observable.merge(
    processHtmlFile(opts, serveAssets, config),
    processJsFile(opts, serveAssets, config),
    processCssFile(opts, serveAssets, config)
  );
});

export default wrap(function *({targetDir = process.cwd(), liveReload}, serveAssets, bs) {

  const configPath = yield getConfigPath(targetDir);

  let configStream;

  if (!configPath) {
    info('cannot found config file, use default configurations');
    const config = {
      title: 'An Enjoyable Playground',
      html: null,
      css: null,
      js: null
    };
    info(JSON.stringify(config, null, 4));
    configStream = Observable.just(config);
  } else {
    configStream = watch(configPath).flatMap(loadConfig);
  }

  Observable.merge(
    configStream.doOnNext(setLocals(serveAssets)),
    configStream.flatMap(processAssetFiles({targetDir}, serveAssets))
  )
    .debounce(100)
    .subscribeOnNext(() => {
      if (liveReload) {
        bs.reload();
      }
    });

});
