import {join} from 'path';
import {wrap} from 'co';
import {prop, path, pipe} from 'ramda';
import {render} from 'ejs';
import {
  getConfigPath,
  readFileToStr,
  writeStrToFile
} from '../../util/FileUtil';
import {
  loadConfig,
  getJsFilePath,
  getCssFilePath,
  getHtmlFilePath
} from '../../util/PlaygroundUtil';
import { info } from '../../util/Log';

const getCssBaseContent = wrap(function *(baseType) {
  switch (baseType) {
  case 'reset':
    return yield readFileToStr(join(__dirname, '..', '..', 'static', 'reset.css'));
  case 'normalize':
    return yield readFileToStr(require.resolve('normalize.css'));
  default:
    return null;
  }
});

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

  const [jsFpath, cssFpath, htmlFpath] = yield [
    getJsFilePath(targetDir, config),
    getCssFilePath(targetDir, config),
    getHtmlFilePath(targetDir, config)
  ];

  const [locals, tmpl] = yield [
    {
      title: prop('title', config),
      js: jsFpath && readFileToStr(jsFpath),
      css: cssFpath && readFileToStr(cssFpath),
      html: htmlFpath && readFileToStr(htmlFpath),
      cssBaseContent: pipe(getCssBaseContent, path(['css', 'base']))(config),
      stylesheets: path(['css', 'external'], config),
      scripts: path(['js', 'external'], config),
    },
    readFileToStr(join(__dirname, '..', '..', '..', 'template', 'bundle.ejs'))
  ];

  const content = render(tmpl, locals);

  writeStrToFile(join(targetDir, 'index.html'), content);
});
