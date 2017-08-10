'use strict';

var router = require('./index.js');
var controller = router.controller.commonData;
var formatParam = router.formatParam;

router.get('/commonData', formatParam, controller.getCommonData);

router.get('/searchCommonData', formatParam, controller.searchCommonData);

router.post('/commonData', formatParam, controller.addCommonData);

router.put('/commonData', formatParam, controller.editCommonData);

router.delete('/commonData', formatParam, controller.deleteCommonData);