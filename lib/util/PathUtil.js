'use strict';

const R = require('ramda');
const path = require('path');

const joinTwo = R.curry(R.binary(path.join));

module.exports = {
  joinTwo,
};
