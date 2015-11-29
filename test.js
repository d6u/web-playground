'use strict';

const co = require('co');
const R = require('ramda');

const func = function () {
  console.log(R.isEmpty(R.pick(['b', 'c'], this)));
};

func.call({a: 123, b: null});
