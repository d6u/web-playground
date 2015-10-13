'use strict';

const Bluebird = require('bluebird');

const fromObservable = observableFactory => new Bluebird((resolve, reject) => {
  const elements = [];

  observableFactory()
    .subscribe(ele => elements.push(ele), reject, () => resolve(elements));
});

module.exports = {
  fromObservable,
};
