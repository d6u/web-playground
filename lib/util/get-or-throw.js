'use strict';

var _ = require('lodash');

module.exports = _.wrap(_.get, function (func, object, path, ErrorType) {
  var value = func(object, path);
  if (value === undefined) {
    throw ErrorType(object, path);
  }
  return value;
});
