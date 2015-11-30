'use strict';

const co = require('co');

co(function *() {
  return yield [
    Promise.resolve('a'),
    {
      a: 0,
      b: Promise.resolve(1),
      c: Promise.resolve(2),
    }
  ];
}).then(console.log);
