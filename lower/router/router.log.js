'use strict';

var router = require('./index.js');
var controller = router.controller.log;
var formatParam = router.formatParam;

router.get('/log', formatParam, controller.searchLog);