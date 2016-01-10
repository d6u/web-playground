import { Observable } from 'rx';
import { curry, converge, prop, path, pipe, defaultTo } from 'ramda';
import { any as hasAnyRequire } from 'has-require';
import { watch, readToStr } from '../../util/FileUtil';
import { DEFAULT_CONFIG } from '../../CONST';
import {
  getJsGlobPattern,
  getCssGlobPattern,
  getHtmlGlobPattern
} from '../../util/AssetUtil';
import { renderSingleJS, renderCSS, renderHTML } from '../../util/RenderUtil';
import { createBundlerStream } from '../../util/CommonJSUtil';

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

/**
 * @param {Object} opts - CLI options
 * @param {string} opts.targetDir - Playground root directory
 * @param {ServeAssets} serveAssets - ServeAssets instance
 * @param {Object} config - Playground configuration
 *
 * @return {Observable} Emit JS code strings when changed
 */
function processJsFile({ targetDir }, serveAssets, config) {
  return watch(getJsGlobPattern(targetDir, config))
    .debounce(100)
    .flatMap(readToStr)
    .map(hasAnyRequire)
    .distinctUntilChanged()
    .flatMap((isRequirePresent) => {
      if (isRequirePresent) {
        return createBundlerStream(targetDir);
      }

      return watch(getJsGlobPattern(targetDir))
        .debounce(100)
        .flatMap(renderSingleJS(config));
    })
    .retry()
    .startWith("console.log('let\'s hack!')")
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

function processHtmlFile({ targetDir }, serveAssets, config) {
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
