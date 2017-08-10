'use strict';

var router = require('./index.js');
var controller = router.controller.error;
var formatParam = router.formatParam;

router.post('/error/upload', formatParam, controller.errorUpload);