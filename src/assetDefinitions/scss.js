import { wrap } from 'co';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const sass = yield resolveModule('node-sass');
    const { css } = yield fromCallback((done) => sass.render({data: str, outputStyle: 'expanded'}, done));
    return css;
  } catch (err) {
    return new RenderError(err.message);
  }
});
