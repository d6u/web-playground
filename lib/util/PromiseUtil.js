'use strict';

const co = require('co');
const Errors = require('../Errors');

const tryInOrder = co.wrap(function *(func, list) {
  let i = 0;
  while (i < list.length) {
    try {
      return yield func(list[i]);
    } catch (err) {
      i += 1;
    }
  }
  throw new Errors.NoMoreFallbacksError();
});

module.exports = {
  tryInOrder,
};
