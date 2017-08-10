'use strict';

var router = require('./index.js');
var controller = router.controller.apiModel;
var formatParam = router.formatParam;

router.get('/apiModelList', formatParam, controller.getApiModelList);

router.get('/apiModel', formatParam, controller.getApiModel);

router.post('/apiModel', formatParam, controller.addApiModel);

router.put('/apiModel', formatParam, controller.editApiModel);

router.delete('/apiModel', formatParam, controller.deleteApiModel);