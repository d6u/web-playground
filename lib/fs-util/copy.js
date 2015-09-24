'use strict';

var fs = require('fs');

module.exports = function copy(src, des, callback) {
  fs.createReadStream(src)
    .pipe(fs.createWriteStream(des))
    .on('finish', callback);
};
