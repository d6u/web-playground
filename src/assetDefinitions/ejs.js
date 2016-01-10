import { wrap } from 'co';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const ejs = yield resolveModule('ejs');
    return ejs.render(str);
  } catch (err) {
    return new RenderError(err.message);
  }
});
