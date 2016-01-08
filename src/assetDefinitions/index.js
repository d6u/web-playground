import Bluebird from 'bluebird';
import R from 'ramda';

const identityAsync = Bluebird.method(R.identity);

export const html = {
  preProcessors: {
    html: {
      extensions: ['html'],
      render: identityAsync,
    },
    ejs: {
      extensions: ['ejs'],
      render: require('./ejs'),
    },
    jade: {
      extensions: ['jade'],
      render: require('./jade'),
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
      render: require('./scss'),
    },
    less: {
      extensions: ['less'],
      render: require('./less'),
    },
    stylus: {
      extensions: ['stylus'],
      render: require('./stylus'),
    },
  },

  postProcessors: {
    raw: {
      render: identityAsync,
    },
    autoprefixer: {
      render: require('./autoprefixer'),
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
      render: require('./babel'),
    },
    coffeescript: {
      extensions: ['coffee'],
      render: require('./coffeescript'),
    },
    typescript: {
      extensions: ['ts'],
      render: require('./typescript'),
    },
  }
};
