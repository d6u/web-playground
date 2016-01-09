import { join, relative } from 'path';
import { wrap } from 'co';
import { prop, path } from 'ramda';
import { green } from 'chalk';
import { safeDump } from 'js-yaml';
import { readToStr, writeStrTo } from '../../util/FileUtil';
import { getConfigPath, loadConfig } from '../../util/ConfigUtil';
import { getJsFilePath, getCssFilePath, getHtmlFilePath } from '../../util/AssetUtil';
import { info } from '../../util/Log';
import { renderTmpl } from '../../util/TemplateUtil';
import { DEFAULT_CONFIG } from '../../CONST';
import { getCssBaseContent } from './helper';

export default wrap(function *({targetDir = process.cwd()}) {

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

  const [jsPath, cssPath, htmlPath] = yield [
    getJsFilePath(targetDir, config),
    getCssFilePath(targetDir, config),
    getHtmlFilePath(targetDir, config)
  ];

  const content = yield renderTmpl('bundle.ejs', {
    title: prop('title', config),
    js: jsPath && readToStr(jsPath),
    css: cssPath && readToStr(cssPath),
    html: htmlPath && readToStr(htmlPath),
    cssBaseContent: getCssBaseContent(path(['css', 'base'], config)),
    stylesheets: path(['css', 'external'], config),
    scripts: path(['js', 'external'], config),
  });

  const fpath = join(targetDir, 'index.html');
  yield writeStrTo(fpath, content);
  info(`created ${green(relative(process.cwd(), fpath))}`);

});
