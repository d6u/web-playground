import co, {wrap} from 'co';
import {
  getConfigPath,
  getDefaultConfigPath,
  copyTmpl
} from '../../util/FileUtil';
import {
  loadConfig,
  getJsFilePath,
  getCssFilePath,
  getHtmlFilePath,
  getDefaultJsFilePath,
  getDefaultCssFilePath,
  getDefaultHtmlFilePath
} from '../../util/PlaygroundUtil';

export default wrap(function *({targetDir = process.cwd()}) {
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
