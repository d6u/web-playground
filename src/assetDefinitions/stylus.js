import { wrap } from 'co';
import { fromCallback } from 'bluebird';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const stylus = yield resolveModule('stylus');
    return yield fromCallback((done) => stylus.render(str, done));
  } catch (err) {
    return new RenderError(err.message);
  }
});
