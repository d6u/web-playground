import { join, relative } from 'path';
import { wrap } from 'co';
import { prop, path } from 'ramda';
import { render } from 'ejs';
import { green } from 'chalk';
import {
  readToStr,
  writeStrTo,
  readAsset
} from '../../util/FileUtil';
import {
  getConfigPath,
  loadConfig
} from '../../util/ConfigUtil';
import {
  getJsFilePath,
  getCssFilePath,
  getHtmlFilePath
} from '../../util/AssetUtil';
import { info } from '../../util/Log';
import { getCssBaseContent } from './helper';

export default wrap(function *({targetDir = process.cwd()}) {

  const configPath = yield getConfigPath(targetDir);

  let config;

  if (!configPath) {
    info('cannot found config file, use default configurations');
    config = {
      title: 'An Enjoyable Playground',
      html: null,
      css: null,
      js: null
    };
    info(JSON.stringify(config, null, 4));
  } else {
    config = yield loadConfig(configPath);
  }


  const [jsPath, cssPath, htmlPath] = yield [
    getJsFilePath(targetDir, config),
    getCssFilePath(targetDir, config),
    getHtmlFilePath(targetDir, config)
  ];


  const [locals, tmpl] = yield [
    {
      title          : prop('title', config),
      js             : jsPath   && readToStr(jsPath),
      css            : cssPath  && readToStr(cssPath),
      html           : htmlPath && readToStr(htmlPath),
      cssBaseContent : getCssBaseContent(path(['css', 'base'], config)),
      stylesheets    : path(['css', 'external'], config),
      scripts        : path(['js', 'external'], config),
    },
    readAsset('bundle.ejs')
  ];

  const content = render(tmpl, locals);
  const fpath = join(targetDir, 'index.html');

  writeStrTo(fpath, content);

  info(`created ${green(relative(process.cwd(), fpath))}`);
});
