import { wrap } from 'co';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const typescript = yield resolveModule('typescript');
    return typescript.transpile(str);
  } catch (err) {
    return new RenderError(err.message);
  }
});
