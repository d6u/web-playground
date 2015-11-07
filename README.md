# Web Playground

[![npm version](https://badge.fury.io/js/web-playground.svg)](http://badge.fury.io/js/web-playground)
[![Build Status](https://travis-ci.org/d6u/web-playground.svg)](https://travis-ci.org/d6u/web-playground)
[![codecov.io](https://codecov.io/github/d6u/web-playground/coverage.svg?branch=master)](https://codecov.io/github/d6u/web-playground?branch=master)

Web Playground is command line tool for quick prototyping, demo, tutorial or presentation in the browser. It works by quickly scaffolding just one HTML, one JavaScript and one CSS file, and opening a browser with live reloading. Optionally, you can update `playground.yml` to enable common preprocessors such as Babel or SASS, or add additional script/style tags to the page.

**Only supports Node >= 4**

## Give it a try by:

**Only compatible with Node 4 or above**

```sh
# Install
npm install -g web-playground

# Scaffold current directory
# This will generate playground.yml, html.html, js.js and css.css in current directory
wpg

# Run `wpg` again to see your page in the browser
wpg
```

Edit `html.html`, `css.css` and `js.js`. Your browser will update instantly. In `playground.yml`, you can find comments on how to enable features like preprocessor and additional scripts tags.

## Preprocessors

Web Playground supports a variety of preprocessors. To enable one, first edit `playground.yml` and uncomment the appropriate section. For example, to enable SCSS, add `preprocessor: scss` under `css` in `playground.yml`:

```yaml
title: An Enjoyable Playground

css:
  preprocessor: scss
```

Then create `css.scss` and start hacking.

### Supported Preprocessors

Web Playground supports a variety of preprocessors. But only a few are builtin (babel, node-scss, ejs). This is to speed up installation and improve start up performance.

Supported preprocessors are:

- html
    - html _(no processing)_
    - [ejs](http://ejs.co/)
    - [jade](http://jade-lang.com/) (**install separately**)
- js
    - js _(no processing)_
    - [babel](https://babeljs.io/)
    - [coffeescript](http://coffeescript.org/) (**install separately**)
    - [typescript](http://www.typescriptlang.org/) (**install separately**)
- css
    - css _(no processing)_
    - [scss](https://github.com/sass/node-sass)
    - [less](http://lesscss.org/) (**install separately**)
    - [stylus](https://learnboost.github.io/stylus/) (**install separately**)

To enable supported external preprocessor, you need to run `npm install <processor_package>` in the same directory as `playground.yml`. For example:

To use CoffeeScript:

1. Run `wpg` to create a `playground.yml`.
2. Add `preprocessor: coffeescript` under `js` in `playground.yml`.
3. Run `npm install coffee-script` (no `-g`) to have coffee-script available in current directory (you will see a `node_modules/` directory).
4. Run `wpg` to create `js.coffee`.
5. Run `wpg` again to start hacking.

## Manual

```txt
Usage: wpg [options]

Options:

  -h, --help                   output usage information
  -V, --version                output the version number
  -b, --bundle                 bundle you playground into a single HTML file, which can be uploaded to the Internet
  -d, --target-dir <dir-name>  target different directory
  --no-open-browser            do not auto open a new browser window when start
  --no-live-reload             disable live reloading (auto refresh browser when file changes)
```

### Bundle

Sometimes you find yourself need to put your awesome work online. You can use the **bundle** feature of Web Playground. Use `-b` flag when you want to publish your playground. `-b` will build and bundle all your assets into one `index.html` file, which you can view just like a webpage without Web Playground.

### Target Different Directory

When you work on lots of demos, `cd` into each dir and start Web Playground is frustrating. You can use `-d` option to specify a different target directory instead of current one. `wpg` will do exactly the same thing as if it was working on current directory. This is also very convenient when you use separately installed preprocessors, since you only have to install it once in `wpg` running directory instead of in each target directory.
