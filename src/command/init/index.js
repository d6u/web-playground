import { basename, relative, dirname, join } from 'path';
import { wrap } from 'co';
import { green } from 'chalk';
import { writeStrTo, readAsset } from '../../util/FileUtil';
import {
  getConfigPath,
  getDefaultConfigPath,
  loadConfig
} from '../../util/ConfigUtil';
import {
  getJsFilePath,
  getCssFilePath,
  getHtmlFilePath,
  getDefaultJsFilePath,
  getDefaultCssFilePath,
  getDefaultHtmlFilePath
} from '../../util/AssetUtil';
import { info } from '../../util/Log';

/**
 * @param {string} fdest
 *
 * @return {Promise -> void}
 */
const copyTmpl = wrap(function *(fdest) {
  const cwd = process.cwd();
  const fname = basename(fdest);
  const rpath = `${dirname(relative(cwd, fdest))}/`;

  info(`found no ${green(fname)} in ${green(rpath)}`);

  const fcontent = yield readAsset(fname);
  yield writeStrTo(fdest, fcontent || '');

  info(`${green(join(rpath, fname))} created`);
});

/**
 * @param {Object} opts
 * @param {string} opts.targetDir
 *
 * @return {Promise -> void}
 */
export default wrap(function *({targetDir}) {

  let fpath = yield getConfigPath(targetDir);

  if (!fpath) {
    fpath = getDefaultConfigPath(targetDir);
    yield copyTmpl(fpath);
  }

  const config = yield loadConfig(fpath);

  let [jsFpath, cssFpath, htmlFpath] = yield [
    getJsFilePath(targetDir, config),
    getCssFilePath(targetDir, config),
    getHtmlFilePath(targetDir, config)
  ];

  if (!jsFpath) {
    jsFpath = getDefaultJsFilePath(targetDir, config);
    yield copyTmpl(jsFpath);
  }

  if (!cssFpath) {
    cssFpath = getDefaultCssFilePath(targetDir, config);
    yield copyTmpl(cssFpath);
  }

  if (!htmlFpath) {
    htmlFpath = getDefaultHtmlFilePath(targetDir, config);
    yield copyTmpl(htmlFpath);
  }
});
