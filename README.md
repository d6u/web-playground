# web-playground

[![npm version](https://badge.fury.io/js/web-playground.svg)](http://badge.fury.io/js/web-playground)
[![Build Status](https://travis-ci.org/d6u/web-playground.svg)](https://travis-ci.org/d6u/web-playground)
[![codecov.io](https://codecov.io/github/d6u/web-playground/coverage.svg?branch=master)](https://codecov.io/github/d6u/web-playground?branch=master)

**web-playground** is command line tool for quickly creating prototypes or demos. It requires no configuration or boilerplate. It has builtin preprocessors, bundler and live reloading server. You can create JS, HTML, or CSS files you need on the fly without worrying about tooling at the beginning.

**web-playground** is never meant to be a tool for developing production ready app. Once the prototype proven to be worthy. You will need to switch gear. That said, **web-playground** provides shortcut to conveniently bundle everything into a single HTML file to you put it online wherever you want.

**Only supports Node >= 4**

## Give it a try

```sh
npm install -g web-playground

# In the directory you want to put your prototypes
# This will create no files, and no file is required at beginning
wpg start

echo "document.write('<h1>Hack the playground!</h1>')" > js.js
```

You can create and edit `js.js`, `html.html` and `css.css` files. Your browser will update instantly. You can also add a `playground.yml` by running `wpg init` to customize the playground for your needs.

## Preprocessors

Web Playground supports a variety of preprocessors. To enable one, first run `wpg init` to create a `playground.yml`. Then uncomment the appropriate section in it. For example, to enable SCSS, add `preprocessor: babel` under `js` in `playground.yml`:

```yaml
js:
  preprocessor: babel
```

### Supported Preprocessors

Web Playground supports a variety of preprocessors. But only a few are builtin (babel, node-scss, and ejs). This is to speed up installation and improve start up performance.

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

To use Less:

1. Run `wpg init` to create a `playground.yml`.
2. Add `preprocessor: less` under `css` in `playground.yml`.
3. Run `npm install less` (no `-g`) to have Less available in current directory (you will see a `node_modules` directory).
4. Run `wpg init` again to create `css.less` or you can just create the file yourself.
5. Run `wpg start` to start hacking.

## CommonJS module

In `js.js` file, you can `require` npm installed modules. web-playground will bundle that for you.

```sh
# In current directory
npm install react react-dom
```

```js
// js.js
var React = require('react');
var ReactDOM = require('react-dom');

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

ReactDOM.render(<MyComponent />, node);
```

## Config file

If `playground.yml` is available in the same directory, web-playground will load it to provide more customizations. Below is the default configurations if no `playground.yml` file is found.

```yaml
title: Cat Playground

html:
  #### Available - ejs, jade
  # preprocessor: ejs

js:
  #### Available - babel, coffeescript, typescript
  preprocessor: babel

  #### These scripts will be added in appearance order and before the your js
  # external:
  #   - 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js'

css:
  #### Available - scss, less, stylus
  preprocessor: scss

  #### Available - autoprefixer
  # vender_prefixing: autoprefixer

  #### Available - reset, normalize
  # base: reset

  #### These stylesheets will be added in appearance order and before the your css
  # external:
  #   - 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'
```

## Manual

```txt
Usage: wpg [options] [command]

Commands:

  init              create boilerplate files in current directory
  start [options]   load config and start local server
  bundle            bundle all asserts into a single HTML file

Options:

  -h, --help                   output usage information
  -V, --version                output the version number
  -d, --target-dir <dir-name>  target different directory
```

### Bundle

Sometimes you find yourself need to put your awesome work online. You can use the **bundle** feature of Web Playground. Use `wpg bundle` flag when you want to publish your playground. It will bundle all your assets into one `index.html` file, which you can view just like a webpage without web-playground.

### Target different directory

When you work on lots of demos, `cd` into each dir and start Web Playground is frustrating. You can use `--target-dir` option to specify a different target directory instead of current one. `wpg` will do exactly the same thing as if it was working on current directory. This is also very convenient when you use separately installed preprocessors or dependent modules. You will only have to install it once in `wpg` running directory instead of each target directory.

## Existing Issues

- CommonJS bundling only support babel as preprocessor. Need supports for CoffeeScript and TypeScript.
- Race condition when switching between CommonJS and none CommonJS bundle. Sometime the old watcher might get loaded to browser because it's slower.
- CommonJS `require` detection depends on [has-require](https://www.npmjs.com/package/has-require). It doesn't distinguish between code and comments.
