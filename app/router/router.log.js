'use strict'
const router = require('./index.js')
const controller = router.controller.log
let formatParam = router.formatParam

router.get('/log', formatParam, controller.searchLog)
