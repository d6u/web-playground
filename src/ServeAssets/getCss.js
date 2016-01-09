/*eslint require-yield:0*/

export default function (serveAssets) {
  return function *() {
    this.set('Content-Type', 'text/css; charset=UTF-8');
    this.body = serveAssets.assets['css'];
  };
}
