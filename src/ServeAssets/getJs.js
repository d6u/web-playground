export default function (req, res) {
  res.set('Content-Type', 'text/javascript; charset=UTF-8');
  res.send(this.assets['js']);
}
