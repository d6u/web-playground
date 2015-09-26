'use strict';

var Observable = require('rx').Observable;
var combineLatest = Observable.combineLatest;
var R = require('ramda');
var pipe = R.pipe;
var of = R.of;
var append = R.append;
var merge = R.merge;
var File = require('./util/file');
var readFile = File.readFile;
var writeFile = File.writeFile;
var watch = File.watch;
var Playground = require('./util/playground');
var parse = Playground.parse;
var getExt = Playground.getExt;
var parsePlaygroundFile = Playground.parsePlaygroundFile;
var createAssetFile = Playground.createAssetFile;
var extensionsForAsset = Playground.extensionsForAsset;
var Observables = require('./util/observables');

var CONSTANT = require('../lib/CONSTANT');
var DEFAULT_OPTS = CONSTANT.DEFAULT_OPTS;

module.exports = function start(_opts) {
  var opts = merge({}, DEFAULT_OPTS, _opts);
  var getExtsForHtml = extensionsForAsset('html');
  var getExtsForJs = extensionsForAsset('js');
  var getExtsForCss = extensionsForAsset('css');

  watch('playground.*')
    .flatMap(parsePlaygroundFile)
    .map(function (playground) {
      var html = watch('html.{' + getExtsForHtml(playground).join(',') + '}');
      var js = watch('js.{' + getExtsForJs(playground).join(',') + '}');
      var css = watch('css.{' + getExtsForCss(playground).join(',') + '}');
      return combineLatest(html, js, css);
    })
    .switch()
    .subscribeOnNext(console.log);


  // var app = express();
  // // app.use(attachData);
  // // app.use(serveAssets);
  // app.listen(opts.port);

  // var bs = require('browser-sync').create();
  // bs.watch().on('change', bs.reload);
  // bs.init({ proxy: 'http://localhost:' + opts.port });
};
