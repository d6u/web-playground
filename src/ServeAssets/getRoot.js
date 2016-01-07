import {join} from 'path';
import {wrap} from 'co';
import {readFile} from 'mz/fs';
import {render} from 'ejs';
import {merge} from 'ramda';

const R = require('ramda');

export default wrap(function *(req, res) {
  let html;

  if (this.assets['htmlErr'] || this.assets['jsErr'] || this.assets['cssErr']) {
    const tmpl = yield readFile();
    html = ejs.render(tmpl, {
      htmlErr: this.assets['htmlErr'],
      cssErr: this.assets['cssErr'],
      jsErr: this.assets['jsErr'],
    });
  } else {
    const tmpl = yield readFile(join(__dirname, '..', '..', 'template', 'errors.ejs'), 'utf8');
    html = render(tmpl, merge({fragment: this.assets['html']}, this.locals));
  }

  res.send(html);
});
