import { render } from 'ejs';
import { wrap } from 'co';
import { readAsset } from '../util/FileUtil';

/**
 * Render target template with provided locals values
 *
 * @param {string} name   File name of the template
 * @param {Object} locals Locals to apply to template
 *
 * @return {string} HTML string
 */
export const renderTmpl = wrap(function *(name, locals) {
  const tmpl = yield readAsset(name);
  return render(tmpl, locals);
});
