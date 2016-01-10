import { join, relative } from 'path';
import { wrap } from 'co';
import { green } from 'chalk';
import { safeDump } from 'js-yaml';
import { writeStrTo } from '../../util/FileUtil';
import { getConfigPath, loadConfig } from '../../util/ConfigUtil';
import { info } from '../../util/Log';
import { renderTmpl } from '../../util/TemplateUtil';
import { DEFAULT_CONFIG } from '../../CONST';
import { getLocals } from './helper';

export default wrap(function *({ targetDir = process.cwd() }) {

  const configPath = yield getConfigPath(targetDir);

  let config;

  if (!configPath) {
    info('cannot found config file, use default configurations');
    config = DEFAULT_CONFIG;
    info('--------------------------');
    info(safeDump(config, {indent: 4}));
  } else {
    config = yield loadConfig(configPath);
  }

  const locals = yield getLocals({ targetDir }, config);
  const content = yield renderTmpl('bundle.ejs', locals);

  const fpath = join(targetDir, 'index.html');
  yield writeStrTo(fpath, content);

  info(`created ${green(relative(process.cwd(), fpath))}`);

});
