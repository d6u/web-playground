'use strict';

var Observables = require('../util/observables');
var unaryJust = Observables.unaryJust;

var html = {
  preProcessors: {
    html: {
      extensions: ['html'],
      render: unaryJust,
    },
    ejs: {
      extensions: ['ejs'],
      render: require('./ejs'),
    },
    // jade: {
    //   extensions: ['jade'],
    //   render: require('./jade'),
    // },
  }
};

var css = {
  preProcessors: {
    css: {
      extensions: ['css'],
      render: unaryJust,
    },
    // scss: {
    //   extensions: ['scss'],
    //   render: require('./scss'),
    // },
    // less: {
    //   extensions: ['less'],
    //   render: require('./less'),
    // },
    // stylus: {
    //   extensions: ['stylus'],
    //   render: require('./stylus'),
    // },
  },

  postProcessors: {
    // raw: {
    //   render: require('../util/identity-async'),
    // },
    // autoprefixer: {
    //   render: require('./autoprefixer'),
    // },
  }
};

var js = {
  preProcessors: {
    js: {
      extensions: ['js'],
      render: unaryJust,
    },
    // babel: {
    //   extensions: ['js', 'jsx', 'es6', 'es'],
    //   render: require('./babel'),
    // },
    // coffeescript: {
    //   extensions: ['coffee'],
    //   render: require('./coffeescript'),
    // },
    // typescript: {
    //   extensions: ['ts'],
    //   render: require('./typescript'),
    // },
  }
};

module.exports = {
  html: html,
  css: css,
  js: js,
};
