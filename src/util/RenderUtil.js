import { wrap } from 'co';
import { bundleDependencies } from './CommonJSUtil';
import {
  getJsRender,
  getCssRender,
  getHtmlRender,
  getPostProcessorForCss
} from './AssetUtil';
import { readToStr } from './FileUtil';

export function renderJS(config) {
  const render = getJsRender(config);

  return wrap(function *(fpath) {
    const fcontent = yield readToStr(fpath);
    const js = yield render(fcontent);
    return yield bundleDependencies(js);
  });
}

export function renderCSS(config) {
  const render = getCssRender(config);
  const postProcess = getPostProcessorForCss(config);

  return wrap(function *(fpath) {
    const fcontent = yield readToStr(fpath);
    const css = yield render(fcontent);
    return yield postProcess(css);
  });
}

export function renderHTML(config) {
  const render = getHtmlRender(config);

  return wrap(function *(fpath) {
    const fcontent = yield readToStr(fpath);
    return yield render(fcontent);
  });
}
