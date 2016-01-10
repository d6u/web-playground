import { Observable } from 'rx';
import { curry, converge, prop, path, pipe, defaultTo } from 'ramda';
import { watch } from '../../util/FileUtil';
import { DEFAULT_CONFIG } from '../../CONST';
import {
  getJsGlobPattern,
  getCssGlobPattern,
  getHtmlGlobPattern
} from '../../util/AssetUtil';
import { renderJS, renderCSS, renderHTML } from '../../util/RenderUtil';

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

function processJsFile({targetDir}, serveAssets, config) {
  return watch(getJsGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(renderJS(config))
    .retry()
    .startWith("try {\n  document.getElementById('playground').innerHTML = 'hello, playground!';\n} catch (err) {}")
    .doOnNext(serveAssets.updateAsset('js'));
}

function processCssFile({targetDir}, serveAssets, config) {
  return watch(getCssGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(renderCSS(config))
    .retry()
    .startWith('#playground {\n  color: rebeccapurple;\n}')
    .doOnNext(serveAssets.updateAsset('css'));
}

function processHtmlFile({targetDir}, serveAssets, config) {
  return watch(getHtmlGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(renderHTML(config))
    .retry()
    .startWith('<div id="playground"></div>')
    .doOnNext(serveAssets.updateAsset('html'));
}

export const processAssetFiles = curry(function (opts, serveAssets, config) {
  return Observable.combineLatest(
    processJsFile(opts, serveAssets, config),
    processCssFile(opts, serveAssets, config),
    processHtmlFile(opts, serveAssets, config)
  );
});
