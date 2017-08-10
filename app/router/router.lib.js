'use strict'
const router = require('./index.js')
const controller = router.controller.lib
let formatParam = router.formatParam

router.get('/libDetail', formatParam, controller.getLibDetail)

router.get('/lib', formatParam, controller.getLibList)

router.post('/lib', formatParam, controller.addLib)

router.put('/lib', formatParam, controller.editLib)

router.delete('/lib', formatParam, controller.deleteLib)
