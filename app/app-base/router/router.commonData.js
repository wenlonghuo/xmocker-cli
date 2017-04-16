'use strict'
const router = require('./index.js')
const controller = router.controller.commonData
let formatParam = router.formatParam

router.get('/commonData', formatParam, controller.getCommonData)

router.get('/searchCommonData', formatParam, controller.searchCommonData)

router.post('/commonData', formatParam, controller.addCommonData)

router.put('/commonData', formatParam, controller.editCommonData)

router.delete('/commonData', formatParam, controller.deleteCommonData)
