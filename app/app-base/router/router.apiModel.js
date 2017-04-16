'use strict'
const router = require('./index.js')
const controller = router.controller.apiModel
let formatParam = router.formatParam

router.get('/apiModelList', formatParam, controller.getApiModelList)

router.get('/apiModel', formatParam, controller.getApiModel)

router.post('/apiModel', formatParam, controller.addApiModel)

router.put('/apiModel', formatParam, controller.editApiModel)

router.delete('/apiModel', formatParam, controller.deleteApiModel)


