import { wrap } from 'co';
import {
  getJsRender,
  getCssRender,
  getHtmlRender,
  getPostProcessorForCss
} from './AssetUtil';
import { readToStr } from './FileUtil';

/**
 * @param {Object} config -
 * @param {string} fpath -
 *
 * @return {Promise<string>} JS code
 */
export function renderSingleJS(config) {
  const render = getJsRender(config);

  return wrap(function *(fpath) {
    const fcontent = yield readToStr(fpath);
    return yield render(fcontent);
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
