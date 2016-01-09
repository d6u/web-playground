import { wrap } from 'co';
import { readAsset } from '../../util/FileUtil';

export const getCssBaseContent = wrap(function *(baseType) {
  switch (baseType) {
  case 'reset':
    return yield readAsset('reset.css');
  case 'normalize':
    return yield readAsset('normalize.css');
  default:
    return null;
  }
});
