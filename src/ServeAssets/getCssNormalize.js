import {wrap} from 'co';
import {readFile} from 'mz/fs';

export default wrap(function *(req, res) {
  res.set('Content-Type', 'text/css; charset=UTF-8');
  const fcontent = yield readFile(require.resolve('normalize.css'));
  res.send(fcontent);
});
