import { wrap } from 'co';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const less = yield resolveModule('less');
    const { css } = yield fromCallback((done) => less.render(str, done));
    return css;
  } catch (err) {
    return new RenderError(err.message);
  }
});
