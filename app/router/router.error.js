'use strict'
const router = require('./index.js')
const controller = router.controller.error
let formatParam = router.formatParam

router.post('/error/upload', formatParam, controller.errorUpload)
