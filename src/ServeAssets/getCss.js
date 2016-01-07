export default function (req, res) {
  res.set('Content-Type', 'text/css; charset=UTF-8');
  res.send(this.assets['css']);
}
