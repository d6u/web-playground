import { dirname } from 'path';
import { wrap } from 'co';
import { prop, path, curryN } from 'ramda';
import { any as hasAnyRequire } from 'has-require';
import { renderSingleJS, renderCSS, renderHTML } from '../../util/RenderUtil';
import { readAsset, readToStr } from '../../util/FileUtil';
import { getJsFilePath, getCssFilePath, getHtmlFilePath } from '../../util/AssetUtil';
import { createBundle } from '../../util/CommonJSUtil';

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

const renderJS = curryN(3, wrap(function *(targetDir, config, fpath) {
  const str = yield readToStr(fpath);

  if (hasAnyRequire(str)) {
    return yield renderSingleJS(config)(fpath);
  }

  return yield createBundle(dirname(fpath));
}));

export const getLocals = wrap(function *({ targetDir }, config) {
  return yield {
    title: prop('title', config),
    js: getJsFilePath(targetDir, config).then(defaultToEmptyStr(renderJS(targetDir, config))),
    css: getCssFilePath(targetDir, config).then(defaultToEmptyStr(renderCSS(config))),
    html: getHtmlFilePath(targetDir, config).then(defaultToEmptyStr(renderHTML(config))),
    cssBaseContent: getCssBaseContent(path(['css', 'base'], config)),
    stylesheets: path(['css', 'external'], config),
    scripts: path(['js', 'external'], config),
  };
});
