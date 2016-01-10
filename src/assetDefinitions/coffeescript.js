import { wrap } from 'co';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const coffee = yield resolveModule('coffee-script');
    return coffee.compile(str);
  } catch (err) {
    return new RenderError(err.message);
  }
});
