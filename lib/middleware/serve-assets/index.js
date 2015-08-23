'use strict';

var express = require('express');
var router = express.Router();

router.get('/', require('./get-root'));
router.get('/javascript.js', require('./get-js'));
router.get('/css.css', require('./get-css'));

module.exports = router;
