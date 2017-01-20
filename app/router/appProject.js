'use strict'
const router = require('./index.js');
const controller = require('../controller/appProject');

let util = require('../util');
let formatParam = util.formatParam;

router.get('/mock/getAppProject', formatParam, controller.getAppProject)

router.post('/mock/addAppProject', formatParam, controller.addAppProject)

router.put('/mock/editAppProject', formatParam, controller.editAppProject)

router.delete('/mock/deleteAppProject', formatParam, controller.deleteAppProject)

router.put('/mock/startAppProject', formatParam, controller.startAppProject)

router.put('/mock/stopAppProject', formatParam, controller.stopAppProject)

router.put('/mock/setDefaultApiParam', formatParam, controller.setDefaultApiParam)
