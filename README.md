[![npm version](https://badge.fury.io/js/web-playground.svg)](http://badge.fury.io/js/web-playground)

# Web Playground

WebPlayground is like CodePen but for your localhost. It scaffolds just one HTML, one JavaScript and one CSS file for you, then open a browser with live reloading. Optionally, you can update `playground.yml` to enable builtin preprocessors or add external scripts.

## Give it a try by:

```sh
npm install -g web-playground

# Scaffold current directory by running
# This will generate playground.yml, html.html, javascript.js and css.css
# in current directory
wpg

# Run `wpg` again to see your page in browser
wpg
```

Edit html.html, css.css and javascript.js. Your browser will update instantly.

## Preprocessors

Web Playground supports a variety of preprocessors. To enable one, first
edit playground.yml and uncomment the appropriate section. Then create a new
file named with the expected file ending for the preprocessor.

For example, to enable CoffeeScript, create javascript.coffee.
Or for SCSS, create css.scss.
