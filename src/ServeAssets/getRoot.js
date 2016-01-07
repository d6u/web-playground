import {join} from 'path';
import {wrap} from 'co';
import {render} from 'ejs';
import {merge} from 'ramda';
import {readFileToStr} from '../util/FileUtil';

const R = require('ramda');

export default wrap(function *(req, res) {
  let html;

  if (this.assets['htmlErr'] || this.assets['jsErr'] || this.assets['cssErr']) {
    const tmpl = yield readFileToStr(join(__dirname, '..', '..', 'template', 'errors.ejs'));
    html = ejs.render(tmpl, {
      htmlErr: this.assets['htmlErr'],
      cssErr: this.assets['cssErr'],
      jsErr: this.assets['jsErr'],
    });
  } else {
    const tmpl = yield readFileToStr(join(__dirname, '..', '..', 'template', 'index.ejs'));
    html = render(tmpl, merge({fragment: this.assets['html']}, this.locals));
  }

  res.send(html);
});
