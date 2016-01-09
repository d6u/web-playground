import { render } from 'ejs';
import { wrap } from 'co';
import { readAsset } from '../util/FileUtil';

/**
 * Render target template with provided locals values
 *
 * @param {string} name   File name of the template
 * @param {Object} locals Locals to apply to template, can be array of promises.
 *                        This function will resolve template and locals at the
 *                        same time to improve performance
 *
 * @return {string} HTML string
 */
export const renderTmpl = wrap(function *(name, locals) {
  const [resolvedLocals, tmpl] = yield [locals, readAsset(name)];
  return render(tmpl, resolvedLocals);
});
