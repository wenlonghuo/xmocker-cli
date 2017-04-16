'use strict'
const router = require('./index.js')
const controller = router.controller.apiBase
let formatParam = router.formatParam

router.get('/apiDetail', formatParam, controller.getApiDetail)

router.get('/api', formatParam, controller.getApiList)

router.get('/apiBase', formatParam, controller.getApiBase)

router.get('/search/api', formatParam, controller.searchApiBase)

router.post('/apiBase', formatParam, controller.addApiBase)

router.put('/apiBase', formatParam, controller.editApiBase)

router.delete('/api', formatParam, controller.deleteApiBase)

router.put('/copyApi', formatParam, controller.copyApi)

router.put('/apiStatus', formatParam, controller.setApiStatus)
