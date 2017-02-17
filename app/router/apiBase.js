'use strict'
const router = require('./index.js')
const controller = require('../controller/apiBase')

let util = require('../util')
let formatParam = util.formatParam

router.get('/mock/getApiDetail', formatParam, controller.getApiDetail)

router.get('/mock/getApiBase', formatParam, controller.getApiBase)

router.get('/mock/searchApiBase', formatParam, controller.searchApiBase)

router.post('/mock/addApiBase', formatParam, controller.addApiBase)

router.put('/mock/editApiBase', formatParam, controller.editApiBase)

router.delete('/mock/deleteApiBase', formatParam, controller.deleteApiBase)

router.put('/mock/copyApi', formatParam, controller.copyApi)

router.put('/mock/setApiStatus', formatParam, controller.setApiStatus)