'use strict';

var router = require('./index.js');
var controller = router.controller.search;
var formatParam = router.formatParam;

router.get('/search', formatParam, controller.search);