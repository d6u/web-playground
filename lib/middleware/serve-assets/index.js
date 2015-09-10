'use strict';

var express = require('express');
var router = express.Router();

router.get('/', require('./get-root'));
router.get('/javascript.js', require('./get-js'));
router.get('/css.css', require('./get-css'));
router.get('/reset.css', require('./get-css-reset'));
router.get('/normalize.css', require('./get-css-normalize'));

module.exports = router;
