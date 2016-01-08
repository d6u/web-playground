import { readAsset } from '../util/FileUtil';

export default function *(req, res) {
  this.set('Content-Type', 'text/css; charset=UTF-8');
  this.body = yield readAsset('normalize.css');
}
