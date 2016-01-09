import { Observable } from 'rx';
import { wrap } from 'co';
import { curry, converge, prop, path, pipe, equals } from 'ramda';
import { safeDump } from 'js-yaml';
import { getConfigPath, loadConfig } from '../../util/ConfigUtil';
import {
  getJsGlobPattern,
  getCssGlobPattern,
  getHtmlGlobPattern,
  getJsRender,
  getCssRender,
  getHtmlRender,
  getPostProcessorForCss
} from '../../util/AssetUtil';
import { watch, readToStr } from '../../util/FileUtil';
import { info, error } from '../../util/Log';
import { DEFAULT_CONFIG } from '../../CONST';

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
  pipe(getLocalsFromPlayground, serveAssets.setLocals)(config);
});

function processHtmlFile({targetDir}, serveAssets, config) {
  return watch(getHtmlGlobPattern(targetDir, config))
    .flatMap(readToStr)
    .flatMap(getHtmlRender(config))
    .doOnNext(serveAssets.updateAsset('html'));
}

function processJsFile({targetDir}, serveAssets, config) {
  return watch(getJsGlobPattern(targetDir, config))
    .flatMap(readToStr)
    .flatMap(getJsRender(config))
    .doOnNext(serveAssets.updateAsset('js'));
}

function processCssFile({targetDir}, serveAssets, config) {
  return watch(getCssGlobPattern(targetDir, config))
    .flatMap(readToStr)
    .flatMap(getCssRender(config))
    .flatMap(getPostProcessorForCss(config))
    .doOnNext(serveAssets.updateAsset('css'));
}

const processAssetFiles = curry(function (opts, serveAssets, config) {
  return Observable.combineLatest(
    processJsFile(opts, serveAssets, config),
    processCssFile(opts, serveAssets, config),
    processHtmlFile(opts, serveAssets, config)
  );
});

/**
 * @param {Object}      opts
 * @param {string}      opts.targetDir
 * @param {boolean}     opts.liveReload
 * @param {ServeAssets} serveAssets
 * @param {BrowserSync} bs
 *
 * @return {void}
 */
export default wrap(function *({targetDir, liveReload}, serveAssets, bs) {

  const configPath = yield getConfigPath(targetDir);

  let configStream;

  if (!configPath) {
    info('cannot find config file, use default configurations');
    const config = DEFAULT_CONFIG;
    info(JSON.stringify(config, null, 4));
    configStream = Observable.just(config);
  } else {
    configStream = watch(configPath)
      .flatMap(loadConfig)
      .distinctUntilChanged(null, equals)
      .doOnNext((config) => {
        info('config updated');
        info('--------------------------');
        info(safeDump(config, {indent: 4}));
      });
  }

  let onlyCssChange = false;

  configStream
    .doOnNext(setLocals(serveAssets))
    .flatMap(processAssetFiles({ targetDir }, serveAssets))
    .distinctUntilChanged(null, ([js0, css0, html0], [js1, css1, html1]) => {
      onlyCssChange = (css0 !== css1) && (js0 === js1 && html0 === html1);
      return js0 === js1 && css0 === css1 && html0 === html1;
    })
    .subscribe(
      () => {
        if (liveReload) {
          if (onlyCssChange) {
            bs.reload('css.css');
          } else {
            bs.reload();
          }
        }
      },
      error);
});
