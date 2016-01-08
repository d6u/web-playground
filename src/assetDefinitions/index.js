import Bluebird from 'bluebird';
import R from 'ramda';
import ejsRender from './ejs';
import jadeRender from './jade';
import scssRender from './scss';
import lessRender from './less';
import stylusRender from './stylus';
import autoprefixerRender from './autoprefixer';
import babelRender from './babel';
import coffeescriptRender from './coffeescript';
import typescriptRender from './typescript';

const identityAsync = Bluebird.method(R.identity);

export const html = {
  preProcessors: {
    html: {
      extensions: ['html'],
      render: identityAsync,
    },
    ejs: {
      extensions: ['ejs'],
      render: ejsRender,
    },
    jade: {
      extensions: ['jade'],
      render: jadeRender,
    },
  }
};

export const css = {
  preProcessors: {
    css: {
      extensions: ['css'],
      render: identityAsync,
    },
    scss: {
      extensions: ['scss'],
      render: scssRender,
    },
    less: {
      extensions: ['less'],
      render: lessRender,
    },
    stylus: {
      extensions: ['stylus'],
      render: stylusRender,
    },
  },

  postProcessors: {
    raw: {
      render: identityAsync,
    },
    autoprefixer: {
      render: autoprefixerRender,
    },
  }
};

export const js = {
  preProcessors: {
    js: {
      extensions: ['js'],
      render: identityAsync,
    },
    babel: {
      extensions: ['js', 'es6', 'es', 'jsx'],
      render: babelRender,
    },
    coffeescript: {
      extensions: ['coffee'],
      render: coffeescriptRender,
    },
    typescript: {
      extensions: ['ts'],
      render: typescriptRender,
    },
  }
};
