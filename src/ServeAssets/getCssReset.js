import { readAsset } from '../util/FileUtil';

export default function () {
  return function *() {
    this.set('Content-Type', 'text/css; charset=UTF-8');
    this.body = yield readAsset('reset.css');
  };
}
