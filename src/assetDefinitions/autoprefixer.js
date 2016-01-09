import { wrap } from 'co';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const [postcss, autoprefixer] = yield [
      resolveModule('postcss'),
      resolveModule('autoprefixer')
    ];

    const prefixer = postcss([autoprefixer]);
    const { css } = prefixer.process(str);

    return css;
  } catch (err) {
    return new RenderError(err.message);
  }
});
