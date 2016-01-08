import { wrap } from 'co';
import { stripColor } from 'chalk';
import { RenderError } from '../Error';
import { resolveModule } from '../util/ModuleUtil';

export default wrap(function *(str) {
  try {
    const [babel, presets] = yield [
      resolveModule('babel-core'),
      [
        resolveModule('babel-preset-es2015'),
        resolveModule('babel-preset-react'),
        resolveModule('babel-preset-stage-0')
      ]
    ];

    const { code } = babel.transform(str, { presets });

    return code;
  } catch (err) {
    return new RenderError(err.message + '\n' + stripColor(err.codeFrame));
  }
});
