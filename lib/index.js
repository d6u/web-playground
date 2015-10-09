'use strict';

const preStart = require('./preStart');

module.exports = () => preStart(() => require('./start')());
