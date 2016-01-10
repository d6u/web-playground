import { wrap } from 'co';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const jade = yield resolveModule('jade');
    return jade.render(str, {pretty: true});
  } catch (err) {
    return new RenderError(err.message);
  }
});
