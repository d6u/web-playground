import { wrap } from 'co';
import { equals } from 'ramda';
import { safeDump } from 'js-yaml';
import { getConfigPath, getConfigGlobPattern, loadConfig } from '../../util/ConfigUtil';
import { watch } from '../../util/FileUtil';
import { info, error } from '../../util/Log';
import { DEFAULT_CONFIG } from '../../CONST';
import { setLocals, processAssetFiles } from './helper';

/**
 * @param {Object}      opts
 * @param {string}      opts.targetDir
 * @param {boolean}     opts.liveReload
 * @param {ServeAssets} serveAssets
 * @param {BrowserSync} bs
 *
 * @return {void}
 */
export default wrap(function *({ targetDir, liveReload }, serveAssets, bs) {

  const configGlobPattern = getConfigGlobPattern(targetDir);

  let configStream = watch(configGlobPattern).flatMap(loadConfig);

  const configPath = yield getConfigPath(targetDir);
  if (!configPath) {
    info('cannot find config file, use default configurations');
    configStream = configStream.startWith(DEFAULT_CONFIG);
  }

  configStream = configStream
    .distinctUntilChanged(null, equals)
    .doOnNext((config) => {
      info('config updated');
      info('--------------------------');
      info(safeDump(config, {indent: 4}));
    });

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
