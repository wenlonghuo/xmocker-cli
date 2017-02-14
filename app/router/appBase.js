'use strict'
const router = require('./index.js')
const controller = require('../controller/appBase')

let util = require('../util')
let formatParam = util.formatParam

router.get('/mock/getAppBase', formatParam, controller.getAppBase)

router.put('/mock/editAppBase', formatParam, controller.editAppBase)

router.get('/mock/getAppStatus', formatParam, controller.getAppStatus)
