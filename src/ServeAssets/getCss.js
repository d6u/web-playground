/*eslint require-yield:0*/

export default function *(next, serveAssets) {
  this.set('Content-Type', 'text/css; charset=UTF-8');
  this.body = serveAssets.assets['css'];
}
