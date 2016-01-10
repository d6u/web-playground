import { wrap } from 'co';
import { prop, path } from 'ramda';
import { renderJS, renderCSS, renderHTML } from '../../util/RenderUtil';
import { readAsset } from '../../util/FileUtil';
import { getJsFilePath, getCssFilePath, getHtmlFilePath } from '../../util/AssetUtil';

const getCssBaseContent = wrap(function *(baseType) {
  switch (baseType) {
  case 'reset':
    return yield readAsset('reset.css');
  case 'normalize':
    return yield readAsset('normalize.css');
  default:
    return null;
  }
});

function defaultToEmptyStr(func) {
  return wrap(function *(input) {
    if (input) {
      return yield func(input);
    }
    return '';
  });
}

export const getLocals = wrap(function *({ targetDir }, config) {
  return yield {
    title: prop('title', config),
    js: getJsFilePath(targetDir, config).then(defaultToEmptyStr(renderJS(config))),
    css: getCssFilePath(targetDir, config).then(defaultToEmptyStr(renderCSS(config))),
    html: getHtmlFilePath(targetDir, config).then(defaultToEmptyStr(renderHTML(config))),
    cssBaseContent: getCssBaseContent(path(['css', 'base'], config)),
    stylesheets: path(['css', 'external'], config),
    scripts: path(['js', 'external'], config),
  };
});
