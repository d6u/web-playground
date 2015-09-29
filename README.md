[![npm version](https://badge.fury.io/js/web-playground.svg)](http://badge.fury.io/js/web-playground)
[![Build Status](https://travis-ci.org/d6u/web-playground.svg)](https://travis-ci.org/d6u/web-playground)

# Web Playground

WebPlayground is like CodePen but for your localhost. It scaffolds just one HTML, one JavaScript and one CSS file for you, then open a browser with live reloading. Optionally, you can update `playground.yml` to enable supported preprocessors or add external script/style tags on the page.

## Give it a try by:

```sh
npm install -g web-playground

# Scaffold current directory
# This will generate playground.yml, html.html, js.js and css.css
# in current directory
wpg

# Run `wpg` again to see your page in browser
wpg
```

Edit `html.html`, `css.css` and `js.js`. Your browser will update instantly. In `playground.yml`, you can find comments on how to enable features like preprocessor and external scripts.

## Preprocessors

Web Playground supports a variety of preprocessors. To enable one, first edit `playground.yml` and uncomment the appropriate section. Running `wpg` (stop `wpg` if is running) will conveniently create empty source file with correct name for you.

For example, to enable SCSS, add `preprocessor: scss` under `css` in `playground.yml`:

```yaml
title: An Enjoyable Playground

css:
  preprocessor: scss
```

And create `css.scss`.

For Babel, you can just add `preprocessor: babel`. No need to add new files since babel recognizes `.js` be default.

### Supported Preprocessors

Web Playground supports a variety of preprocessors. But only a few are builtin, e.g. babel, node-scss, ejs. This is to speed up installation and start up performance.

Supported preprocessors are:

- html
    - html _(No Processing)_
    - [ejs](http://ejs.co/)
    - [jade](http://jade-lang.com/) **Install Separately**
- js
    - js _(No Processing)_
    - [babel](https://babeljs.io/)
    - [coffeescript](http://coffeescript.org/) **Install Separately**
    - [typescript](http://www.typescriptlang.org/) **Install Separately**
- css
    - css _(No Processing)_
    - [scss](https://github.com/sass/node-sass)
    - [less](http://lesscss.org/) **Install Separately**
    - [stylus](https://learnboost.github.io/stylus/) **Install Separately**

To enable supported external preprocessors, you need to run `npm install <processor_module>` in same directory as `playground.yml`. For example:

To use CoffeeScript:

1. Run `wpg` to create a `playground.yml` if haven't done so.
2. Add `preprocessor: coffeescript` under `js` in `playground.yml`.
3. Add `npm install coffee-script` (`-g` is not necessary).
4. Run `wpg` to create `js.coffee`.
5. Run `wpg` again to start hacking.
