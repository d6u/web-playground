'use strict';

var Bluebird = require('bluebird');
var _ = require('lodash');

// Usage:
//
// Bluebird
//   .all([1,2,3,4])
//   .tryInOrder(function (n) {
//     if (n !== 4) {
//       return Bluebird.reject('Not 4');
//     }
//     return Bluebird.resolve('Is 4');
//   })
//   .then(console.log, console.log) => Is 4

Bluebird.prototype.tryInOrder = function tryInOrder(factory) {
  return this.then(function (arr) {
    var i = 0;
    var error = new Bluebird.AggregateError();

    function tryNext() {
      if (i < arr.length) {
        return factory(arr[i++]).catch(function (err) {
          error.push(err);
          return tryNext();
        });
      }
      throw error;
    }

    return tryNext();
  });
};

Bluebird.prototype.tapOnError = function tapOnError() {
  var _handler = _.wrap(_.last(arguments), function (func, err) {
    return Bluebird
      .try(func, [err], this)
      .reflect()
      .throw(err);
  });
  var args = _.dropRight(arguments, 1).concat([_handler]);

  return this.catch.apply(this, args);
};

module.exports = Bluebird;
