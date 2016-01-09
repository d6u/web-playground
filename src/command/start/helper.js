import { Observable } from 'rx';
import { curry, converge, prop, path, pipe, defaultTo } from 'ramda';
import { watch } from '../../util/FileUtil';
import { DEFAULT_CONFIG } from '../../CONST';
import {
  getJsGlobPattern,
  getCssGlobPattern,
  getHtmlGlobPattern,
  getJsRender,
  getCssRender,
  getHtmlRender,
  getPostProcessorForCss
} from '../../util/AssetUtil';
import { readToStr } from '../../util/FileUtil';

const getLocalsFromPlayground = converge(
  (title, cssBase, stylesheets, scripts) => ({title, cssBase, stylesheets, scripts}),
  [
    pipe(prop('title'), defaultTo(DEFAULT_CONFIG.title)),
    pipe(path(['css', 'base']), defaultTo(null)),
    pipe(path(['css', 'external']), defaultTo(null)),
    pipe(path(['js', 'external']), defaultTo(null))
  ]
);

export const setLocals = curry(function (serveAssets, config) {
  pipe(getLocalsFromPlayground, serveAssets.setLocals)(config);
});

function processHtmlFile({targetDir}, serveAssets, config) {
  return watch(getHtmlGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(readToStr)
    .flatMap(getHtmlRender(config))
    .startWith('<div id="playground"></div>')
    .retry()
    .doOnNext(serveAssets.updateAsset('html'));
}

function processJsFile({targetDir}, serveAssets, config) {
  return watch(getJsGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(readToStr)
    .flatMap(getJsRender(config))
    .startWith("try {\n  document.getElementById('playground').innerHTML = 'hello, playground!';\n} catch (err) {}")
    .retry()
    .doOnNext(serveAssets.updateAsset('js'));
}

function processCssFile({targetDir}, serveAssets, config) {
  return watch(getCssGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(readToStr)
    .flatMap(getCssRender(config))
    .flatMap(getPostProcessorForCss(config))
    .startWith('#playground {\n  color: rebeccapurple;\n}')
    .retry()
    .doOnNext(serveAssets.updateAsset('css'));
}

export const processAssetFiles = curry(function (opts, serveAssets, config) {
  return Observable.combineLatest(
    processJsFile(opts, serveAssets, config),
    processCssFile(opts, serveAssets, config),
    processHtmlFile(opts, serveAssets, config)
  );
});
